jest.mock('vue-router', () => ({
    createWebHistory: () => ({}),
    createRouter: jest.fn(() => ({ push: jest.fn(), beforeEach: jest.fn() })),
    useRouter: jest.fn(),
  }))
  jest.mock('@/composables/useFetch')
  jest.mock('@/composables/usePrintRecipe')
  
  import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
  import { ref } from 'vue'
  import RecipesPage from '@/pages/RecipesPage.vue'
  import AppHeader from '@/components/AppHeader.vue'
  import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
  import { useRouter } from 'vue-router'
  import { useFetch } from '@/composables/useFetch'
  import { usePrintRecipe } from '@/composables/usePrintRecipe'
  
  describe('RecipesPage.vue', () => {
    let pushMock: jest.Mock
    let reloadMock: jest.Mock
    const recipesRef = ref<Array<any>>([])
    const loadingRef = ref(false)
    const errorRef = ref('')
  
    beforeEach(() => {
      pushMock = jest.fn()
      ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
      reloadMock = jest.fn()
      recipesRef.value = []
      loadingRef.value = false
      errorRef.value = ''
      ;(useFetch as jest.Mock).mockReturnValue({
        data: recipesRef,
        loading: loadingRef,
        error: errorRef,
        reload: reloadMock,
      })
      ;(usePrintRecipe as jest.Mock).mockReturnValue({
        loading: false,
        error: '',
        printRecipe: jest.fn(),
      })
      jest.clearAllMocks()
    })
  
    it('renderiza título, input e header', () => {
      const wrapper = mount(RecipesPage, {
        global: {
          stubs: { AppHeader: true, ConfirmDeleteModal: true, 'router-link': RouterLinkStub },
        },
      })
      expect(wrapper.findComponent(AppHeader).exists()).toBe(true)
      expect(wrapper.find('h2.recipes-page__title').text()).toBe('Suas receitas')
      expect(wrapper.find('input.recipes-page__search-input').exists()).toBe(true)
    })
  
    it('mostra loading quando loading=true', () => {
      loadingRef.value = true
      const wrapper = mount(RecipesPage, {
        global: { stubs: { AppHeader: true, 'router-link': RouterLinkStub } },
      })
      expect(wrapper.find('.recipes-page__info').text()).toBe('Carregando receitas…')
    })
  
    it('mostra error quando error não vazio', () => {
      errorRef.value = 'Falha'
      const wrapper = mount(RecipesPage, {
        global: { stubs: { AppHeader: true, 'router-link': RouterLinkStub } },
      })
      expect(wrapper.find('.recipes-page__error').text()).toBe('Falha')
    })
  
    it('mostra mensagem vazia e link para criar quando não há receitas', () => {
      recipesRef.value = []
      const wrapper = mount(RecipesPage, {
        global: {
          stubs: { AppHeader: true, 'router-link': RouterLinkStub },
        },
      })
      expect(wrapper.find('.recipes-page__info').text()).toContain('Nenhuma receita encontrada.')
      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.props('to')).toBe('/receitas/criar')
    })
  
    it('renderiza tabela quando há receitas', async () => {
      recipesRef.value = [
        { id: 1, name: 'A', preparation_time_minutes: 5, servings: 1 },
        { id: 2, name: 'B', preparation_time_minutes: 10, servings: 2 },
      ]
      const wrapper = mount(RecipesPage, {
        global: { stubs: { AppHeader: true, 'router-link': RouterLinkStub } },
      })
      await flushPromises()
      const rows = wrapper.findAll('tbody.recipes-page__tbody tr')
      expect(rows).toHaveLength(2)
    })
  
    it('filtra receitas pelo nome', async () => {
      recipesRef.value = [
        { id: 1, name: 'Alpha', preparation_time_minutes: 5, servings: 1 },
        { id: 2, name: 'Beta', preparation_time_minutes: 10, servings: 2 },
      ]
      const wrapper = mount(RecipesPage, {
        global: { stubs: { AppHeader: true, 'router-link': RouterLinkStub } },
      })
      await flushPromises()
      await wrapper.find('input.recipes-page__search-input').setValue('beta')
      const rows = wrapper.findAll('tbody.recipes-page__tbody tr')
      expect(rows).toHaveLength(1)
      expect(rows[0].text()).toContain('Beta')
    })
  
    it('navega ao clicar em visualizar e editar', async () => {
      recipesRef.value = [{ id: 3, name: 'X', preparation_time_minutes: 1, servings: 1 }]
      const wrapper = mount(RecipesPage, {
        global: { stubs: { AppHeader: true, 'router-link': RouterLinkStub } },
      })
      await flushPromises()
      const buttons = wrapper.findAll('button.recipes-page__button')
      await buttons[0].trigger('click')
      expect(pushMock).toHaveBeenCalledWith('/receitas/3')
      await buttons[1].trigger('click')
      expect(pushMock).toHaveBeenCalledWith('/receitas/3/editar')
    })
  
    it('chama printRecipe ao clicar em imprimir', async () => {
      const printMock = jest.fn()
      ;(usePrintRecipe as jest.Mock).mockReturnValue({ loading: false, error: '', printRecipe: printMock })
      recipesRef.value = [{ id: 4, name: 'Y', preparation_time_minutes: 2, servings: 1 }]
      const wrapper = mount(RecipesPage, {
        global: { stubs: { AppHeader: true, ConfirmDeleteModal: true } },
      })
      await flushPromises()
      const printBtn = wrapper.findAll('button.recipes-page__button')[3]
      await printBtn.trigger('click')
      expect(printMock).toHaveBeenCalledWith(4, 'Y')
    })
  
    it('abre modal e deleta e recarrega', async () => {
      recipesRef.value = [{ id: 5, name: 'Z', preparation_time_minutes: 3, servings: 1 }]
      global.fetch = jest.fn().mockResolvedValue({ ok: true })
      const wrapper = mount(RecipesPage, {
        global: { stubs: { AppHeader: true, 'router-link': RouterLinkStub } },
      })
      await flushPromises()
      const deleteBtn = wrapper.findAll('button.recipes-page__button')[2]
      await deleteBtn.trigger('click')
      const modal = wrapper.findComponent(ConfirmDeleteModal)
      expect(modal.exists()).toBe(true)
      await modal.vm.$emit('confirm')
      await flushPromises()
      expect(global.fetch).toHaveBeenCalledWith('/recipes/5', { method: 'DELETE' })
      expect(reloadMock).toHaveBeenCalled()
    })
  })
  
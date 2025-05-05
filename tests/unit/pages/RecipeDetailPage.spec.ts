jest.mock('vue-router', () => ({
    createWebHistory: () => ({}),
    createRouter: jest.fn(() => ({ push: jest.fn(), beforeEach: jest.fn() })),
    useRouter: jest.fn(),
    useRoute: jest.fn(),
  }))
  jest.mock('@/store/auth', () => ({
    useAuthStore: jest.fn(),
  }))
  jest.mock('@/composables/usePrintRecipe', () => ({
    usePrintRecipe: jest.fn(),
  }))
  
  import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
  import RecipeDetailPage from '@/pages/RecipeDetailPage.vue'
  import AppHeader from '@/components/AppHeader.vue'
  import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
  import api from '@/services/api'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  import { usePrintRecipe } from '@/composables/usePrintRecipe'
  
  jest.mock('@/services/api')
  
  describe('RecipeDetailPage.vue', () => {
    let pushMock: jest.Mock
    const recipeData = {
      id: 7,
      name: 'Panqueca',
      preparation_time_minutes: 15,
      servings: 3,
      preparation_method: 'Misturar e fritar',
      ingredients: 'ovo, leite, farinha',
      userId: 123,
      categoryId: 1,
      author: '123',
    }
  
    beforeEach(() => {
      pushMock = jest.fn()
      ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
      ;(useRoute as jest.Mock).mockReturnValue({ params: { id: '7' } })
      ;(useAuthStore as unknown as jest.Mock).mockReturnValue({ userId: 123 })
      ;(usePrintRecipe as jest.Mock).mockReturnValue({
        loading: false,
        error: '',
        printRecipe: jest.fn(),
      })
      jest.clearAllMocks()
    })
  
    it('renderiza dados da receita quando fetch succeed', async () => {
      ;(api.get as jest.Mock).mockResolvedValue({ data: recipeData })
      const wrapper = mount(RecipeDetailPage, {
        global: {
          stubs: { AppHeader: true, ConfirmDeleteModal: true, 'router-link': RouterLinkStub },
        },
      })
      await flushPromises()
      expect(wrapper.find('h2').text()).toBe('Panqueca')
      expect(wrapper.text()).toContain('15 min')
      expect(wrapper.text()).toContain('Porções: 3')
      const items = wrapper.findAll('ul li')
      expect(items).toHaveLength(3)
      expect(wrapper.findAll('button')).toHaveLength(3)
    })
  
    it('exibe mensagem de erro 404 quando não existe', async () => {
      ;(api.get as jest.Mock).mockRejectedValue({ response: { status: 404 } })
      const wrapper = mount(RecipeDetailPage, {
        global: {
          stubs: { AppHeader: true, ConfirmDeleteModal: true, 'router-link': RouterLinkStub },
        },
      })
      await flushPromises()
      const info = wrapper.find('.info')
      expect(info.text()).toBe('Receita não existe.')
      expect(wrapper.find('.detail-card').exists()).toBe(false)
    })
  
    it('chama printRecipe ao clicar em Imprimir', async () => {
      const printMock = jest.fn()
      ;(usePrintRecipe as jest.Mock).mockReturnValue({
        loading: false,
        error: '',
        printRecipe: printMock,
      })
      ;(api.get as jest.Mock).mockResolvedValue({ data: recipeData })
      const wrapper = mount(RecipeDetailPage, {
        global: { stubs: { AppHeader: true, ConfirmDeleteModal: true } },
      })
      await flushPromises()
      const buttons = wrapper.findAll('button')
      const printButton = buttons.at(2)!
      await printButton.trigger('click')
      expect(printMock).toHaveBeenCalledWith(7, 'Panqueca')
    })
  
    it('abre modal e ao confirmar exclui e navega', async () => {
      ;(api.get as jest.Mock).mockResolvedValue({ data: recipeData })
      ;(api.delete as jest.Mock).mockResolvedValue({})
      const wrapper = mount(RecipeDetailPage, {
        global: { stubs: { AppHeader: true, 'router-link': RouterLinkStub } },
      })
      await flushPromises()
      const deleteButton = wrapper.findAll('button').at(1)!
      await deleteButton.trigger('click')
      const modal = wrapper.findComponent(ConfirmDeleteModal)
      expect(modal.exists()).toBe(true)
      await modal.vm.$emit('confirm')
      await flushPromises()
      expect(api.delete).toHaveBeenCalledWith('/recipes/7')
      expect(pushMock).toHaveBeenCalledWith('/receitas')
    })
  })
  
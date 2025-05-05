jest.mock('vue-router', () => ({
  createWebHistory: () => ({}),
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    beforeEach: jest.fn(),
  })),
  useRouter: jest.fn(),
}))

import { mount, flushPromises } from '@vue/test-utils'
import CreateRecipePage from '@/pages/CreateRecipePage.vue'
import RecipeForm from '@/components/RecipeForm.vue'
import AppHeader from '@/components/AppHeader.vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

jest.mock('@/services/api')

describe('CreateRecipePage.vue', () => {
  let pushMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    jest.clearAllMocks()
  })

  it('exibe o título e renderiza os componentes filhos', () => {
    const wrapper = mount(CreateRecipePage, {
      global: {
        stubs: { AppHeader: true, RecipeForm: true }
      }
    })

    expect(wrapper.find('h2.create-page__title').text()).toBe('Criar Receita')
    expect(wrapper.findComponent(AppHeader).exists()).toBe(true)
    expect(wrapper.findComponent(RecipeForm).exists()).toBe(true)
  })

  it('ao submeter o formulário, chama api.post e navega para /receitas', async () => {
    const wrapper = mount(CreateRecipePage, {
      global: { stubs: { AppHeader: true } }
    })

    const sampleData = {
      name: 'Bolo',
      preparation_time_minutes: 30,
      servings: 4,
      preparation_method: 'Assar',
      ingredients: 'Farinha, Ovos, Açúcar',
      categoryId: '1',
    }

    await wrapper.findComponent(RecipeForm).vm.$emit('submit', sampleData)
    await flushPromises()

    expect(api.post).toHaveBeenCalledWith('/recipes', sampleData)
    expect(pushMock).toHaveBeenCalledWith('/receitas')
  })
})

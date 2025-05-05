jest.mock('vue-router', () => ({
  createWebHistory: () => ({}),
  createRouter: jest.fn(() => ({ push: jest.fn(), beforeEach: jest.fn() })),
  useRouter: jest.fn(),
  useRoute: jest.fn(),
}))

import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import EditRecipePage from '@/pages/EditRecipePage.vue'
import RecipeForm from '@/components/RecipeForm.vue'
import AppHeader from '@/components/AppHeader.vue'
import api from '@/services/api'
import { useRouter, useRoute } from 'vue-router'

jest.mock('@/services/api')

describe('EditRecipePage.vue', () => {
  let pushMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(useRoute as jest.Mock).mockReturnValue({ params: { id: '42' } })
    jest.clearAllMocks()
  })

  it('exibe título e formulário quando fetch succeed', async () => {
    ;(api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        name: 'Bolo',
        preparation_time_minutes: 10,
        servings: 2,
        preparation_method: 'Assar',
        ingredients: 'Farinha, Açúcar',
        category: { id: '5' },
      },
    })
    const wrapper = mount(EditRecipePage, {
      global: {
        stubs: {
          AppHeader: true,
          RecipeForm: true,
        },
      },
    })
    await flushPromises()
    expect(wrapper.find('h2.edit-page__title').text()).toBe('Editar Receita')
    expect(wrapper.findComponent(RecipeForm).exists()).toBe(true)
    expect(wrapper.find('.edit-page__error').exists()).toBe(false)
  })

  it('exibe mensagem de erro 404 quando api.get rejeita com 404', async () => {
    ;(api.get as jest.Mock).mockRejectedValueOnce({ response: { status: 404 } })
    const wrapper = mount(EditRecipePage, {
      global: {
        stubs: {
          AppHeader: true,
          RecipeForm: true,
          'router-link': RouterLinkStub,
        },
      },
    })
    await flushPromises()
    const errorDiv = wrapper.find('.edit-page__error')
    expect(errorDiv.text()).toContain('Receita não encontrada.')
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/receitas')
    expect(wrapper.findComponent(RecipeForm).exists()).toBe(false)
  })

  it('ao submeter formulário chama api.put e navega', async () => {
    ;(api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        name: '',
        preparation_time_minutes: 0,
        servings: 0,
        preparation_method: '',
        ingredients: '',
        category: { id: '' },
      },
    })
    ;(api.put as jest.Mock).mockResolvedValueOnce({})
    const wrapper = mount(EditRecipePage, {
      global: {
        stubs: {
          AppHeader: true,
          RecipeForm: true,
        },
      },
    })
    await flushPromises()
    const sampleData = {
      name: 'Test',
      preparation_time_minutes: 5,
      servings: 1,
      preparation_method: 'M',
      ingredients: 'I',
      categoryId: '5',
    }
    await wrapper.findComponent(RecipeForm).vm.$emit('submit', sampleData)
    await flushPromises()
    expect(api.put).toHaveBeenCalledWith('/recipes/42', sampleData)
    expect(pushMock).toHaveBeenCalledWith('/receitas')
  })
})

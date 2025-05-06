jest.mock('vue-router', () => ({
  createWebHistory: () => ({}),
  createRouter: jest.fn(() => ({ push: jest.fn(), beforeEach: jest.fn() })),
  useRouter: jest.fn(),
  useRoute: jest.fn(),
}))

import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import EditRecipePage from '@/pages/EditRecipePage.vue'
import RecipeForm from '@/components/RecipeForm.vue'
import { nextTick, ref } from 'vue'
import api from '@/services/api'
import { useRouter, useRoute } from 'vue-router'

import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/store/auth'

jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('@/services/api')

describe('EditRecipePage.vue', () => {
  let pushMock: jest.Mock
  let authStoreMock: any

  beforeEach(() => {
    pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(useRoute as jest.Mock).mockReturnValue({ params: { id: '42' } })

    const pinia = createPinia()
    setActivePinia(pinia)

    authStoreMock = {
      token: ref(null),
      logout: jest.fn(),
    }
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(authStoreMock)

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
        plugins: [createPinia()],
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
})

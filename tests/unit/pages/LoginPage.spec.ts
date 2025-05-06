jest.mock('vue-router', () => ({
  createWebHistory: () => ({}),
  createRouter: jest.fn(() => ({ push: jest.fn(), beforeEach: jest.fn() })),
  useRouter: jest.fn(),
  useRoute: jest.fn(),
}))

import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import { ref } from 'vue'
import LoginPage from '@/pages/LoginPage.vue'
import AppHeader from '@/components/AppHeader.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

jest.mock('@/composables/useAuth')
jest.mock('@/services/api')

describe('LoginPage.vue', () => {
  let pushMock: jest.Mock
  let doLoginMock: jest.Mock
  const token = ref<string | null>(null)
  const error = ref('')
  const loading = ref(false)

  beforeEach(() => {
    pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    doLoginMock = jest.fn()
    ;(useAuth as jest.Mock).mockReturnValue({
      token,
      error,
      loading,
      login: doLoginMock,
    })
    token.value = null
    error.value = ''
    loading.value = false
    jest.clearAllMocks()
  })

  it('renderiza campos e link de registro', () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          AppHeader: true,
          'router-link': {
            template: '<a :href="to" class="login-page__register-link"><slot /></a>',
            props: ['to'],
          },
        },
        components: { BaseInput, BaseButton },
      },
    })
    expect(wrapper.findComponent(AppHeader).exists()).toBe(true)
    expect(wrapper.find('h2.login-page__title').text()).toBe('Login')
    expect(wrapper.find('input#login').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('button.login-page__button').exists()).toBe(true)
    const paragraphWrapper = wrapper.find('p.login-page__register')
    expect(paragraphWrapper.exists()).toBe(true)
    expect(paragraphWrapper.text()).toContain('Não tem uma conta?')
  })

  it('ao submeter com sucesso chama doLogin e navega', async () => {
    doLoginMock.mockResolvedValue(true)
    const wrapper = mount(LoginPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    await wrapper.find('input#login').setValue('user1')
    await wrapper.find('input#password').setValue('pass1')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(doLoginMock).toHaveBeenCalledWith({ login: 'user1', password: 'pass1' })
    expect(pushMock).toHaveBeenCalledWith('/receitas')
  })

  it('mostra indicador de loading enquanto carrega', async () => {
    loading.value = true
    const wrapper = mount(LoginPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    expect(wrapper.find('.login-page__loading').text()).toBe('Entrando...')
    expect(wrapper.find('button.login-page__button').exists()).toBe(false)
  })

  it('mostra mensagem de erro quando há erro', async () => {
    error.value = 'Falha no login'
    const wrapper = mount(LoginPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    expect(wrapper.find('.login-page__error').text()).toBe('Falha no login')
  })
})

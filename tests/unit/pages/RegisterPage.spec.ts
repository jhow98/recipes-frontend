jest.mock('vue-router', () => ({
  createWebHistory: () => ({}),
  createRouter: jest.fn(() => ({ push: jest.fn(), beforeEach: jest.fn() })),
  useRouter: jest.fn(),
}))

import { mount, flushPromises } from '@vue/test-utils'
import RegisterPage from '@/pages/RegisterPage.vue'
import AppHeader from '@/components/AppHeader.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import api from '@/services/api'
import axios from 'axios'
import { useRouter } from 'vue-router'

jest.mock('@/services/api')

describe('RegisterPage.vue', () => {
  let pushMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renderiza campos e botão', () => {
    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    expect(wrapper.findComponent(AppHeader).exists()).toBe(true)
    expect(wrapper.find('input#login').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('input#name').exists()).toBe(true)
    expect(wrapper.find('button.register-page__button').exists()).toBe(true)
  })

  it('valida campos vazios', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.register-page__error').text()).toBe('Preencha todos os campos.')
  })

  it('valida senha curta', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    await wrapper.find('input#login').setValue('u')
    await wrapper.find('input#password').setValue('123')
    await wrapper.find('input#name').setValue('Name')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.register-page__error').text()).toBe(
      'A senha deve conter pelo menos 6 caracteres.'
    )
  })

  it('valida nome curto', async () => {
    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    await wrapper.find('input#login').setValue('user')
    await wrapper.find('input#password').setValue('123456')
    await wrapper.find('input#name').setValue('A')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.register-page__error').text()).toBe('Informe um nome válido.')
  })

  it('sucesso no cadastro e redireciona após 1s', async () => {
    (api.post as jest.Mock).mockResolvedValue({})
    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    await wrapper.find('input#login').setValue('user')
    await wrapper.find('input#password').setValue('123456')
    await wrapper.find('input#name').setValue('John Doe')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.register-page__loading').exists()).toBe(true)
    await flushPromises()
    expect(wrapper.find('.register-page__success').text()).toBe(
      'Usuário cadastrado com sucesso!'
    )
    jest.advanceTimersByTime(1000)
    expect(pushMock).toHaveBeenCalledWith('/login')
  })

  it.each([
    [400, 'Verifique os dados preenchidos.'],
    [409, 'Login já existe.'],
    [500, 'Erro interno do servidor.'],
    [418, 'Ops! Nosso servidor está acordando agora — aguarde 1 minutinho e tente de novo. 🍃'],
  ])('tratamento de erro %i', async (status, expected) => {
    const err = { response: { status } }
    ;(api.post as jest.Mock).mockRejectedValue(err)
    const wrapper = mount(RegisterPage, {
      global: {
        stubs: { AppHeader: true },
        components: { BaseInput, BaseButton },
      },
    })
    await wrapper.find('input#login').setValue('user')
    await wrapper.find('input#password').setValue('123456')
    await wrapper.find('input#name').setValue('John Doe')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.find('.register-page__error').text()).toBe(expected)
  })
})

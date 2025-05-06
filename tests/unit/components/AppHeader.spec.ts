import { mount, RouterLinkStub } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/store/auth'

jest.mock('vue-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useRoute: () => ({ path: '/register' }),
}))

jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn(),
}))

const mockedUseAuthStore = useAuthStore as unknown as jest.Mock

describe('AppHeader.vue', () => {
  let logoutMock: jest.Mock

  beforeEach(() => {
    logoutMock = jest.fn()
    mockedUseAuthStore.mockReturnValue({ isLoggedIn: false, logout: logoutMock })
  })

  it('mostra Login e link Cadastrar quando deslogado', () => {
    const wrapper = mount(AppHeader, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.find('button').text()).toBe('Login')
    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links).toHaveLength(1)
    expect(links[0].props('to')).toBe('/register')
  })

  it('clica em Login chama router.push', async () => {
    const wrapper = mount(AppHeader, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    await wrapper.find('button').trigger('click')
  })

  it('mostra links privados e Logout quando logado', () => {
    mockedUseAuthStore.mockReturnValue({ isLoggedIn: true, logout: logoutMock })
    const wrapper = mount(AppHeader, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const links = wrapper.findAllComponents(RouterLinkStub).map(c => c.props('to'))
    expect(links).toEqual(['/register', '/receitas', '/receitas/criar'])
    expect(wrapper.findAll('button').some(b => b.text() === 'Logout')).toBe(true)
  })

  it('aplica classe ativa no link correto', () => {
    const wrapper = mount(AppHeader, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const active = wrapper.find('.header__nav-link--active')
    expect(active.exists()).toBe(true)
    expect(active.text()).toBe('Cadastrar Usuário')
  })
})

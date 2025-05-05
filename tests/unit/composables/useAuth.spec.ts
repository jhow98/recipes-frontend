import { useAuth } from '@/composables/useAuth'

jest.mock('@/services/api', () => ({
  post: jest.fn()
}))

jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
  default: jest.fn()
}))

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn()
}))

const mockApiPost = require('@/services/api').post as jest.Mock
const mockIsAxiosError = require('axios').isAxiosError as jest.Mock
const mockUseRouter = require('vue-router').useRouter as jest.Mock
const mockUseAuthStore = require('@/store/auth').useAuthStore as jest.Mock

describe('useAuth', () => {
  let mockPush: jest.Mock
  let mockSetToken: jest.Mock
  let mockLogout: jest.Mock

  beforeEach(() => {
    mockPush = jest.fn()
    mockSetToken = jest.fn()
    mockLogout = jest.fn()

    mockUseRouter.mockReturnValue({
      push: mockPush
    })

    mockUseAuthStore.mockReturnValue({
      token: { value: null },
      isLoggedIn: { value: false },
      setToken: mockSetToken,
      logout: mockLogout
    })

    jest.clearAllMocks()
  })

  describe('login()', () => {
    it('deve fazer login com sucesso', async () => {
      mockApiPost.mockResolvedValue({
        data: { access_token: 'test-token' }
      })

      const { login } = useAuth()
      const result = await login({ login: 'user', password: 'pass' })

      expect(result).toBe(true)
      expect(mockSetToken).toHaveBeenCalledWith('test-token')
      expect(mockApiPost).toHaveBeenCalledWith('/auth/login', {
        login: 'user',
        password: 'pass'
      })
    })

    it('deve lidar com erro de credenciais inválidas', async () => {
      mockApiPost.mockRejectedValue({
        response: { status: 401 },
        isAxiosError: true
      })
      mockIsAxiosError.mockReturnValue(true)

      const { login, error } = useAuth()
      await login({ login: 'user', password: 'wrong' })

      expect(error.value).toBe('Credenciais inválidas.')
    })
  })

  describe('logout()', () => {
    it('deve executar logout corretamente', () => {
      const { logout } = useAuth()
      logout()

      expect(mockLogout).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})
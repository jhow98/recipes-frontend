import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'
import axios from 'axios'

interface Credentials {
  login: string
  password: string
}

interface AuthResponse {
  access_token: string
}

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const error = ref('')
  const loading = ref(false)

  async function login(credentials: Credentials): Promise<boolean> {
    error.value = ''
    if (!credentials.login || !credentials.password) {
      error.value = 'Preencha todos os campos.'
      return false
    }

    loading.value = true
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      authStore.setToken(response.data.access_token)
      return true
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status
        error.value = getErrorMessage(status)
      } else {
        error.value = 'Ocorreu um erro inesperado.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  function getErrorMessage(status?: number): string {
    switch (status) {
      case 400:
        return 'Preencha corretamente os dados.'
      case 401:
        return 'Credenciais inválidas.'
      case 500:
        return 'Erro interno do servidor.'
      default:
        return 'Servidor acordando… aguarde um minuto e tente novamente.'
    }
  }

  function logout(): void {
    authStore.logout()
    router.push('/login')
  }

  return {
    token: authStore.token,
    isLoggedIn: authStore.isLoggedIn,
    error,
    loading,
    login,
    logout,
  }
}

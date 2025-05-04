import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'
import axios from 'axios'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const error = ref('')
  const loading = ref(false)

  async function login(credentials: { login: string; password: string }) {
    error.value = ''
    if (!credentials.login || !credentials.password) {
      error.value = 'Preencha todos os campos.'
      return false
    }
    loading.value = true
    try {
      const response = await api.post('/auth/login', credentials)
      authStore.setToken(response.data.access_token)
      return true
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status
        if (status === 400) {
          error.value = 'Preencha corretamente os dados.'
        } else if (status === 401) {
          error.value = 'Credenciais inválidas.'
        } else if (status === 500) {
          error.value = 'Erro interno do servidor.'
        } else {
          error.value = 'Servidor acordando… aguarde um minuto e tente novamente.'
        }
      } else {
        error.value = 'Ocorreu um erro inesperado.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
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

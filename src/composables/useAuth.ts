import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import axios from 'axios'

const token = ref<string | null>(localStorage.getItem('token'))

export function useAuth() {
  const router = useRouter()
  const error = ref('')
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    localStorage.setItem('token', t)
  }

  function clearToken() {
    token.value = null
    localStorage.removeItem('token')
  }

  async function login(credentials: { login: string; password: string }) {
    error.value = ''
    if (!credentials.login || !credentials.password) {
      error.value = 'Preencha todos os campos.'
      return
    }
    loading.value = true
    try {
      const response = await api.post('/auth/login', credentials)
      setToken(response.data.access_token)
      router.push('/receitas') // Redireciona aqui após o login bem-sucedido
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
    } finally {
      loading.value = false
    }
  }

  function logout() {
    clearToken()
    router.push('/login')
  }

  return { token, isLoggedIn, error, loading, login, logout }
}

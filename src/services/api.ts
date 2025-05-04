import axios from 'axios'
import type { RawAxiosRequestHeaders } from 'axios'
import { AxiosHeaders } from 'axios'
import { useAuthStore } from '@/store/auth'
import router from '@/router'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000
})

const getAuthHeader = (): RawAxiosRequestHeaders => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

api.interceptors.request.use(config => {
  const headers = new AxiosHeaders(config.headers)
  const authHeaders = getAuthHeader()
  for (const [key, value] of Object.entries(authHeaders)) {
    headers.set(key, value)
  }
  config.headers = headers
  return config
}, error => Promise.reject(error))

api.interceptors.response.use(
  response => response,
  error => {
    const url = error.config?.url
    const status = error.response?.status

    if (url === '/auth/login' && status === 401) {
      return Promise.reject(error)
    }

    if (status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
    }

    return Promise.reject(error)
  }
)

export default api

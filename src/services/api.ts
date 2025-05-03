import axios from 'axios'
import type { RawAxiosRequestHeaders } from 'axios'
import { AxiosHeaders } from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10_000,
})

export function authHeader(): RawAxiosRequestHeaders {
  const token = localStorage.getItem('token')
  return token
    ? { Authorization: `Bearer ${token}` }
    : {}
}

api.interceptors.request.use((config) => {
  const h = new AxiosHeaders(config.headers)

  for (const [k, v] of Object.entries(authHeader())) {
    h.set(k, v!)
  }

  config.headers = h

  return config
}, (err) => Promise.reject(err))

export default api

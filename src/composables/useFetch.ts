import { ref, onMounted } from 'vue'
import api from '@/services/api'
import type { AxiosRequestConfig } from 'axios'

export function useFetch<T>(url: string, options?: AxiosRequestConfig) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const res = await api.request<T>({ url, ...options })
      data.value = res.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { data, loading, error, reload: load }
}

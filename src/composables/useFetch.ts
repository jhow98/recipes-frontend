import api from '@/services/api'
import { ref } from 'vue'

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    data.value = null
    try {
      const response = await api.get<T>(url)
      data.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Não foi possível carregar dados.'
    } finally {
      loading.value = false
    }
  }

  load()

  return { data, loading, error, reload: load }
}

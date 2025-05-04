import { ref, onMounted } from 'vue'
import api from '@/services/api'

export function useCategories() {
  const categories = ref<{ id: number; name: string }[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/categories')
      categories.value = response.data
    } catch (err: any) {
      error.value = 'Erro ao buscar categorias, aguarde alguns minutos e recarregue a página'
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { categories, loading, error, reload: load }
}

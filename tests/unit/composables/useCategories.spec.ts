import { useCategories } from '@/composables/useCategories'

jest.mock('@/services/api', () => ({
  get: jest.fn(),
}))

const mockApiGet = require('@/services/api').get as jest.Mock

describe('useCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve retornar os valores iniciais corretamente', () => {
    const { categories, loading, error } = useCategories()

    expect(categories.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  describe('load()', () => {
    it('deve carregar categorias com sucesso', async () => {
      const mockCategories = [
        { id: 1, name: 'Categoria 1' },
        { id: 2, name: 'Categoria 2' },
      ]
      mockApiGet.mockResolvedValue({ data: mockCategories })

      const { categories, loading, error, reload } = useCategories()
      await reload()

      expect(categories.value).toEqual(mockCategories)
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
      expect(mockApiGet).toHaveBeenCalledWith('/categories')
    })

    it('deve lidar com erro ao carregar categorias', async () => {
      mockApiGet.mockRejectedValue(new Error('Erro de rede'))

      const { loading, error, reload } = useCategories()
      await reload()

      expect(loading.value).toBe(false)
      expect(error.value).toBe(
        'Erro ao buscar categorias, aguarde alguns minutos e recarregue a página'
      )
    })
  })

  describe('reload()', () => {
    it('deve recarregar as categorias quando chamado', async () => {
      const mockCategories = [{ id: 1, name: 'Categoria 1' }]
      mockApiGet.mockResolvedValue({ data: mockCategories })

      const { categories, reload } = useCategories()
      await reload()

      expect(categories.value).toEqual(mockCategories)
      expect(mockApiGet).toHaveBeenCalledTimes(1)
    })
  })
})

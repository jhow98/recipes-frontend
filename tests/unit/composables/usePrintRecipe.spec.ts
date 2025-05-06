jest.mock('@/services/api', () => ({ get: jest.fn() }))
jest.mock('jspdf', () => ({ jsPDF: jest.fn() }))
jest.mock('html2canvas', () => ({ __esModule: true, default: jest.fn() }))

import { usePrintRecipe } from '@/composables/usePrintRecipe'
import api from '@/services/api'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

describe('usePrintRecipe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fluxo de sucesso', async () => {
    const recipe = {
      id: 5,
      name: 'Test',
      preparation_time_minutes: 12,
      servings: 2,
      ingredients: 'a,b,c',
      preparation_method: 'mix',
      user: { name: 'auth' },
    }
    ;(api.get as jest.Mock).mockResolvedValue({ data: recipe })

    const html2canvasMock = html2canvas as jest.Mock
    const fakeCanvas = {
      width: 100,
      height: 50,
      toDataURL: jest.fn().mockReturnValue('data-url'),
    }
    html2canvasMock.mockResolvedValue(fakeCanvas)

    const addImage = jest.fn()
    const addPage = jest.fn()
    const save = jest.fn()
    ;(jsPDF as unknown as jest.Mock).mockImplementation(() => ({
      internal: { pageSize: { getWidth: () => 200, getHeight: () => 100 } },
      addImage,
      addPage,
      save,
    }))

    const { loading, error, printRecipe } = usePrintRecipe()
    const p = printRecipe(5, 'MyRecipe')

    expect(loading.value).toBe(true)

    await p

    expect(api.get).toHaveBeenCalledWith('/recipes/5')

    expect(html2canvasMock).toHaveBeenCalledWith(expect.any(HTMLDivElement), { scale: 2 })
    expect(fakeCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.9)

    expect(addImage).toHaveBeenCalled()

    expect(save).toHaveBeenCalledWith('ReceitasApp - MyRecipe.pdf')

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fluxo de erro', async () => {
    ;(api.get as jest.Mock).mockRejectedValue(new Error('fail'))
    const { loading, error, printRecipe } = usePrintRecipe()
    await printRecipe(1, 'X')
    expect(loading.value).toBe(false)
    expect(error.value).toBe('Não foi possível gerar o PDF. Tente novamente mais tarde.')
  })
})

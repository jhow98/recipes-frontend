import api from '@/services/api'
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import headerImage from '@/assets/images/header-pdf.png'

export function usePrintRecipe() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function printRecipe(id: number, name: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/recipes/${id}`)
      const recipe = res.data

      const container = document.createElement('div')
      container.style.width = '794px'
      container.style.padding = '20px'
      container.style.background = 'white'
      container.innerHTML = `
        <img src="${headerImage}" style="width:100%; margin-bottom:20px" />
        <h1 style="font-size:24pt; margin-bottom:10px;">${recipe.name}</h1>
        <div style="margin-bottom:15px; font-size:12pt; color:#333;">
          Tempo de preparo: ${recipe.preparation_time_minutes} min | Porções: ${recipe.servings}
        </div>
        <h3 style="margin-top:0; color:#666;">Ingredientes</h3>
        <ul>${recipe.ingredients
          .split(',')
          .map((i: string) => `<li>${i.trim()}</li>`)
          .join('')}</ul>
        <h3 style="color:#666;">Modo de Preparo</h3>
        <p>${recipe.preparation_method}</p>
        <p>Receita criada por <strong>${recipe.user.name}</strong></p>
      `
      console.log(recipe)
      document.body.appendChild(container)

      const canvas = await html2canvas(container, { scale: 2 })
      const imgData = canvas.toDataURL('image/jpeg', 0.9)
      document.body.removeChild(container)

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      let position = 0
      let heightLeft = imgHeight

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position -= pageHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`ReceitasApp - ${name}.pdf`)
    } catch (e: any) {
      error.value = 'Não foi possível gerar o PDF. Tente novamente mais tarde.'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, printRecipe }
}

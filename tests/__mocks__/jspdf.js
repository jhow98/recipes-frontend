const addImage = jest.fn()
const save = jest.fn()

export const jsPDF = jest.fn(() => ({
  addImage,
  save,
}))

export default { jsPDF }
export { addImage, save }

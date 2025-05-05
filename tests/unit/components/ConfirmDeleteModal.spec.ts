import { mount } from '@vue/test-utils'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'

describe('ConfirmDeleteModal.vue', () => {
  it('exibe a mensagem e emite eventos ao clicar nos botões', async () => {
    const wrapper = mount(ConfirmDeleteModal)

    // mensagem
    expect(wrapper.text()).toContain('Tem certeza que deseja excluir esta receita?')

    // botão Cancelar emite 'cancel'
    await wrapper.find('button.confirm-modal__button--cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')![0]).toEqual([])

    // botão Confirmar emite 'confirm'
    await wrapper.find('button.confirm-modal__button--confirm').trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')![0]).toEqual([])
  })
})

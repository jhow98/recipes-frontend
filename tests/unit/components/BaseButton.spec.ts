import { mount } from '@vue/test-utils'
import BaseButton from '@/components/BaseButton.vue'

describe('BaseButton.vue', () => {
  it('renderiza slot e aplica classe disabled quando prop disabled=true', async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Botão' }
    })
    expect(wrapper.text()).toBe('Botão')
    expect(wrapper.classes()).toContain('base-button--disabled')
  })
})

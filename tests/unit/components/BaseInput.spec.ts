import { mount } from '@vue/test-utils'
import BaseInput from '@/components/BaseInput.vue'

describe('BaseInput.vue', () => {
  const factory = (props = {}) => {
    return mount(BaseInput, {
      props: {
        label: 'Meu rótulo',
        id: 'campo1',
        type: 'text',
        modelValue: 'valor inicial',
        placeholder: 'digite algo',
        ...props
      }
    })
  }

  it('renderiza o label correto e associa ao input', () => {
    const wrapper = factory()
    const label = wrapper.get('label')
    expect(label.text()).toBe('Meu rótulo')
    expect(label.attributes('for')).toBe('campo1')

    const input = wrapper.get('input')
    expect(input.attributes('id')).toBe('campo1')
  })

  it('configura type, placeholder e valor do input via props', () => {
    const wrapper = factory({ type: 'email', modelValue: 'abc', placeholder: 'seu e‑mail' })
    const input = wrapper.get('input')
    expect(input.attributes('type')).toBe('email')
    expect(input.attributes('placeholder')).toBe('seu e‑mail')
    expect((input.element as HTMLInputElement).value).toBe('abc')
  })

  it('ao digitar emite update:modelValue com o novo valor', async () => {
    const wrapper = factory({ modelValue: '' })
    const input = wrapper.get('input')
    await input.setValue('novo texto')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const ev = wrapper.emitted('update:modelValue')![0]
    expect(ev).toEqual(['novo texto'])
  })
})

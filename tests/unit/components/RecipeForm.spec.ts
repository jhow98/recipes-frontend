import { shallowMount } from '@vue/test-utils'
import RecipeForm from '@/components/RecipeForm.vue'

jest.mock('@/services/api', () => ({}))
jest.mock('@/composables/useCategories', () => ({ useCategories: () => ({ categories: [], loading: false, error: '' }) }))

describe('RecipeForm (simplificado)', () => {
  it('monta o form sem erros', () => {
    const wrapper = shallowMount(RecipeForm, {
      props: {
        modelValue: {
          name: '',
          preparation_time_minutes: 0,
          servings: 1,
          ingredients: '',
          preparation_method: '',
          categoryId: ''
        },
        submitLabel: 'OK'
      },
      global: { stubs: ['BaseInput','BaseButton'] }
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })
})

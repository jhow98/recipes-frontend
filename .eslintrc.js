// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    vueFeatures: { scriptSetup: true },
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  rules: {
    // até 4 atributos numa linha única, e em multilinha no máximo 1 por linha
    'vue/max-attributes-per-line': ['warn', {
      singleline: 4,
      multiline: 1
    }],
    // desliga checagem rígida de ordem de atributos
    'vue/attributes-order': 'off',
    // desliga exigência de nome multi‑palavra em componentes
    'vue/multi-word-component-names': 'off',
    // (opcionais) ajuste de severidade ou outras regras que deseje
    // '@typescript-eslint/no-explicit-any': 'warn',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
};

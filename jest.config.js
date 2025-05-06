/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|webp|svg|css|less|sass|scss)$': 'jest-transform-stub',
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@vue/test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js',
    '\\.(png|jpe?g|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },

  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/cypress/',
    '<rootDir>/cypress/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
  testMatch: ['**/tests/unit/**/*.spec.(js|jsx|ts|tsx)', '**/__tests__/*.(js|jsx|ts|tsx)'],
}

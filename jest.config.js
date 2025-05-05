module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)'
  ],
  setupFiles: ['<rootDir>/jest.setup.js']
}

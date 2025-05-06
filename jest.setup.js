const { config } = require('@vue/test-utils')

config.global.stubs = {
  RouterLink: true,
  RouterView: true,
}

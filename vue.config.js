const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  chainWebpack: config => {
    const absCypress = path.resolve(__dirname, 'src/cypress')
    ;['ts', 'tsx', 'js', 'jsx'].forEach(ext => {
      config.module.rule(ext).exclude.add(absCypress).end()
    })
  },
}

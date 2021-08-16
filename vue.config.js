module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
  },
  chainWebpack: (config) => {
    config
      .entry('app')
      .clear()
      .add('./example/main.js')
  },
  configureWebpack: {
    output: {
      libraryExport: 'default',
    },
  },
  css: {
    extract: false,
  },
}

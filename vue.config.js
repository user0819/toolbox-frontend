const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // 确保没有其他配置覆盖publicPath
  },
  // 确保环境变量被正确加载
  devServer: {
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/'
})
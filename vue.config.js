module.exports = {
  transpileDependencies: true,
  configureWebpack: {
    // 确保没有其他配置覆盖publicPath
  },
  devServer: {
    proxy: {
      '/proxy': {
        target: process.env.VUE_APP_API_BASE_URL,
        pathRewrite: { '^/proxy': '' },
        changeOrigin: true,
        secure: false // 添加以支持 HTTPS
      }
    }
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/'
};
module.exports = {
  publicPath: './',
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/linebot': {
        disableHostCheck: true,
        target: 'https://www.tbbt.com.tw/linebot/',
        pathRewrite: { '^/linebot': '' },
        changeOrigin: true,
        ws: true
      },
      '/shop': {
        disableHostCheck: true,
        target: 'https://www.tbbt.com.tw/shop/',
        pathRewrite: { '^/shop': '' },
        changeOrigin: true,
        ws: true
      },
      '/user-bg': {
        disableHostCheck: true,
        target: 'https://www.tbbt.com.tw/user-bg/',
        pathRewrite: { '^/user-bg': '' },
        changeOrigin: true,
        ws: true
      },
      '/ads': {
        disableHostCheck: true,
        target: 'https://www.tbbt.com.tw/ads/',
        pathRewrite: { '^/ads': '' },
        changeOrigin: true,
        ws: true
      }
    }
  }
}
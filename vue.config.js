module.exports = {
  publicPath: './',
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/linebot': {
        target: 'https://www.tbbt.com.tw/linebot/',
        pathRewrite: { '^/linebot': '' },
        changeOrigin: true,
        ws: true
      },
      '/shop': {
        target: 'https://www.tbbt.com.tw/shop/',
        pathRewrite: { '^/shop': '' },
        changeOrigin: true,
        ws: true
      },
      '/user-bg': {
        target: 'https://www.tbbt.com.tw/user-bg/',
        pathRewrite: { '^/user-bg': '' },
        changeOrigin: true,
        ws: true
      },
      '/ads': {
        target: 'https://www.tbbt.com.tw/ads/',
        pathRewrite: { '^/ads': '' },
        changeOrigin: true,
        ws: true
      }
    }
  }
}
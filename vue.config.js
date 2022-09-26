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
      }
    }
  }
}
const path = require('path')
const webpack = require('webpack')
const ExtractText = require('extract-text-webpack-plugin')
const HtmlWebpack = require('html-webpack-plugin')
const FriendlyErrorsWebpack = require('friendly-errors-webpack-plugin')

const plugins = [
  new ExtractText({filename: './css/style.css'}),
  new HtmlWebpack({
    hash: true,
    title: 'Line bot platform',
    template: './src/index.html',
    minify: {
      collapseWhitespace: true
    }
  }),
  new FriendlyErrorsWebpack()
]

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './js/build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ExtractText.extract({
              use: 'css-loader',
              fallback: 'vue-style-loader'
            })
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 30000,
              name: 'img/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'fonts/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: ExtractText.extract({
          use: 'less-loader'
        })
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    port: 9090
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: plugins
}

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: process.env.NODE_ENV === 'production' ? JSON.stringify('production') : JSON.stringify('test')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

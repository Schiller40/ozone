const { resolve } = require('path')
const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'vue-style-loader' }, { loader: 'css-loader' }]
})
rules.push({
  test: /\.scss$/,
  use: [{ loader: 'vue-style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
})
rules.push({
  test: /\.(jpg|svg|png)$/,
  use: [
    {
      loader: 'file-loader',
      options: { outputPath: './main_window', publicPath: '../main_window' }
    }
  ]
})

rules.push({
  test: /\.vue$/,
  use: [{ loader: 'vue-loader' }, { loader: 'vue-svg-inline-loader' }]
})

plugins.push(new VueLoaderPlugin())

module.exports = {
  module: {
    rules
  },
  plugins: plugins,
  resolve: {
    alias: {
      '@': resolve('./src/app'),
      '~': resolve('./src/app')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.scss', '.css', '.vue', '.jpg', '.png', '.svg']
  }
}

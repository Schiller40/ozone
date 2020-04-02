const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.vue$/,
  loader: 'vue-loader'
});

plugins.push( new VueLoaderPlugin())

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    alias: {
        '@': 'src/app',
        '~': 'src/app'
      },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.vue']
  },
};

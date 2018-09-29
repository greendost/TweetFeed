const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  entry: {
    app: ['webpack-hot-middleware/client', './src/client/index.js'],
    login: ['webpack-hot-middleware/client', './src/client/login.js']
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  plugins: [new webpack.HotModuleReplacementPlugin()]
});

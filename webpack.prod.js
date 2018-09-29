const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: {
    app: ['./src/client/index.js'],
    login: ['./src/client/login.js']
  },
  mode: 'production'
});

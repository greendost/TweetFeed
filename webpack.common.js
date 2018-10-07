// if using global webpack.  Switch to local for portability
// const childProcess = require('child_process');
// const globalPkgDir = childProcess
//   .execSync('npm root -g')
//   .toString()
//   .trim();
// console.log('dir=' + (globalPkgDir + '/' + 'webpack'));
// const webpack = require(globalPkgDir + '/' + 'webpack');
const webpack = require('webpack');
const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(tsx?)|(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist'
  },
  plugins: [new CaseSensitivePathsPlugin()]
};

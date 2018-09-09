const childProcess = require('child_process');
const globalPkgDir = childProcess
  .execSync('npm root -g')
  .toString()
  .trim();
console.log('dir=' + (globalPkgDir + '/' + 'webpack'));
const webpack = require(globalPkgDir + '/' + 'webpack');
const path = require('path');

module.exports = {
  entry: {
    app: ['webpack-hot-middleware/client', './src/client/index.js'],
    login: ['webpack-hot-middleware/client', './src/client/login.js']
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: 'env' }
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
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist'
  },
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  plugins: [new webpack.HotModuleReplacementPlugin()]
};

// use: ['style-loader', 'css-loader']

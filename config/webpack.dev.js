const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',

  devtool: 'eval-source-map',

  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'),
      publicPath: '/',
    },
    compress: true,
    port: 3000,
    hot: true,
    liveReload: true,
    open: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },

  optimization: {
    minimize: false,
  },

  plugins: [...common.plugins],
});

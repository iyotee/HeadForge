const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    background: './src/background/background.ts',
    content: './src/content/content-script.ts',
    popup: './src/popup/popup.ts',
    options: './src/options/options.ts',
  },

  output: {
    path: path.resolve(__dirname, '../store'),
    filename: '[name]/[name].js',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
        },
        {
          from: 'src/assets',
          to: 'assets',
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: 'src/popup/popup.html',
      filename: 'popup/popup.html',
      chunks: ['popup'],
    }),

    new HtmlWebpackPlugin({
      template: 'src/options/options.html',
      filename: 'options/options.html',
      chunks: ['options'],
    }),

    new MiniCssExtractPlugin({
      filename: '[name]/[name].css',
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  devtool: 'source-map',
};

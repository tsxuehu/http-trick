'use strict';
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

let entry = {
  manager: './src/manager/index.js',
  monitor: './src/monitor/index.js',
  // wsmock: './src/wsmock/index.js'
};
let htmlPlugins = Object.keys(entry).map(pageName => {
  return new HtmlWebpackPlugin({
    filename: path.resolve(__dirname, '../../site', `${pageName}.html`),
    template: 'index.html',
    inject: true,
    chunks: ['vendor', pageName],
  })
});

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry,
  output: {
    path: path.resolve(__dirname, '../../site'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      'src': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "img/[name].[ext]"
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: "fonts/[name].[ext]"
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new FriendlyErrorsWebpackPlugin()
  ].concat(htmlPlugins),
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          enforce: true,
          priority: 100,
          minChunks: 1,
          chunks: 'all'
        },
      },
    },
  }
};

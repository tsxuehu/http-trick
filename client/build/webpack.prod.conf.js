'use strict';
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
});

module.exports = webpackConfig;

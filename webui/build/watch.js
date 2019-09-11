var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.watch.conf')

var spinner = ora('building for dev...')
spinner.start()

var compiler = webpack(webpackConfig);
var watching = compiler.watch({
}, function(err, stats) {

});

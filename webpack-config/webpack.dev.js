const Common = require('./webpack.common');
const {merge} = require('webpack-merge');
const {distPath} = require('./paths');

module.exports = merge(Common,{
    mode:'development',
    devServer: {
        contentBase: distPath,
        compress: false,
        port: 9000,
        open: true
    },
})
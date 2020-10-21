const Common = require('./webpack.common');
const {merge} = require('webpack-merge');
const {srcPath, distPath} = require('./paths');

module.exports = merge(Common,{
    mode:'production',
})
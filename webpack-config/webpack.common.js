const path = require('path');
const { srcPath, distPath } = require('./paths');

module.exports = {
    entry: srcPath,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output:{
        path:distPath
    },
}
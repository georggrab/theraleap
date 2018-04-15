const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const common = require('./webpack.config');

module.exports = {
    ...common,
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new HardSourceWebpackPlugin()
    ]
}
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.config');
const webpack = require('webpack');

module.exports = {
    ...common,
    mode: "production",
    devtool: false,
    optimization: {
        minimize: true,
        splitChunks: {
            name: 'manifest'
        }
    },
    plugins: [
        new HardSourceWebpackPlugin(),
        new HtmlWebpackPlugin()
    ]
}
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: "./src/main.ts",
    devtool: 'inline-source-map',
    output: {
        filename: "./dist/bundle.js"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".vue"],
        plugins: [
            new TsconfigPathsPlugin({})
        ]
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        ts: 'ts-loader'
                    }
                }
            },
            { 
                test: /\.tsx?$/, 
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
        ]
    }
}

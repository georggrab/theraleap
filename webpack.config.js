const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path')

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
        ],
        alias: {
            styles: path.resolve(__dirname, './assets/')
        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        ts: 'ts-loader'
                    },
                    postcss: [
                        require('postcss-font-magician')({
                            foundries: ['google'],
                            variants: {
                                'Inconsolata': {}
                            }
                        })
                    ]
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

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  output: {
    filename: "./dist/bundle.js"
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".vue"],
    plugins: [new TsconfigPathsPlugin({})],
    alias: {
      styles: path.resolve(__dirname, "./assets/")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            ts: "ts-loader"
          },
        }
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      }
    ]
  }
};

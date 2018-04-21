const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  plugins: [
      new HardSourceWebpackPlugin()
  ],
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".vue"],
    plugins: [
      new TsconfigPathsPlugin({})
    ],
    alias: {
      assets: path.resolve(__dirname, "./assets/")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            ts: {
              loader: "ts-loader",
              options: {
                appendTsSuffixTo: [/\.vue$/]
              }
            }
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

if (process.env.NODE_ENV === 'production') {
  module.exports.mode = "production";
  module.exports.devtool = false;
  module.exports.optimization = {
    minimize: true,
    splitChunks: {
        name: 'manifest'
    }
  }
  // for Github Pages Deployment
  module.exports.output.publicPath = "/theraleap/"
}
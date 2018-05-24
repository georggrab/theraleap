const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const path = require("path");
const rxPaths = require("rxjs/_esm5/path-mapping");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

let definitions = {
  __path__: JSON.stringify("/")
};

const precachePlugin = new SWPrecacheWebpackPlugin({
  cacheId: "theraleap",
  filename: "service-worker.js",
  minify: false,
  stripPrefix: "dist",
  staticFileGlobs: [
    "dist/*.html",
    "dist/*.js",
    "dist/**/*.json",
    "dist/*.woff2"
  ]
});

module.exports = {
  entry: "./src/main.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  plugins: [new BundleAnalyzerPlugin(), precachePlugin],
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".vue"],
    plugins: [new TsconfigPathsPlugin({})],
    alias: {
      assets: path.resolve(__dirname, "./assets/"),
      ...rxPaths()
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
          }
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

if (process.env.NODE_ENV === "production") {
  module.exports.mode = "production";
  module.exports.devtool = false;
  module.exports.optimization = {
    minimize: true,
    splitChunks: {
      name: "manifest"
    }
  };
  definitions.__path__ = JSON.stringify("/theraleap/");
  // for Github Pages Deployment
  module.exports.output.publicPath = "/theraleap/";

  precachePlugin.replacePrefix = "/theraleap";
  precachePlugin.navigateFallback = ["/therleap/index.html"];
}

module.exports.plugins.push(new webpack.DefinePlugin(definitions));

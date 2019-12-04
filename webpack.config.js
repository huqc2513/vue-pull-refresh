const path = require("path");
const webpack = require("webpack");
const uglify = require("uglifyjs-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: "./src/index.js",
  devServer: {
    clientLogLevel: "warning",
    hot: true,
    contentBase: false,
    compress: true,
    host: "0.0.0.0",
    port: 9999,
    open: true
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "vue-pull-refresh.min.js",
    libraryTarget: "umd",
    // 　libraryTarget：为了支持多种使用场景，我们需要选择合适的打包格式。libraryTarget 属性。这是可以控制 library 如何以不同方式暴露的选项。
    umdNamedDefine: true
  },
  externals: {
    vue: "vue"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: "style-loader"
      //     },
      //     {
      //       loader: "css-loader"
      //     },
      //     {
      //       loader: "scss-loader"
      //     }
      //   ]
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader", //babel的相关配置在.babelrc文件里
        options: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        test: /\.(png|jpg|gif|ttf|svg|woff|eot)$/,
        loader: "url-loader",
        query: {
          limit: 30000
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   output: {
    //     comments: false
    //   }
    // })
  ]
};

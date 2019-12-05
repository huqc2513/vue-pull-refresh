const path = require("path");
const webpack = require("webpack");
const uglify = require("uglifyjs-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isdev = process.env.NODE_ENV === "development";

const config = {
  mode: "development",
  entry: isdev ? "./example/main.js" : "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    // publicPath: '/dist/',
    filename: "index.js",
    libraryTarget: "umd",
    library: "vpull",
    // 　libraryTarget：为了支持多种使用场景，我们需要选择合适的打包格式。libraryTarget 属性。这是可以控制 library 如何以不同方式暴露的选项。
    umdNamedDefine: true
  },
  externals: {
    vue: "Vue"
  },
  resolve: {
    extensions: [".js", ".vue", ".less", ".css", ".scss"]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader" //babel的相关配置在.babelrc文件里
      },
      {
        test: /\.(png|jpg|gif|ttf|svg|woff|eot)$/,
        loader: "url-loader",
        query: {
          limit: 30000
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin({
      transformAssetUrls: {
        video: ["src", "poster"],
        source: "src",
        img: "src",
        image: ["xlink:href", "href"],
        use: ["xlink:href", "href"]
      }
    }),
    new HtmlWebpackPlugin({
      inject: "body",
      env: isdev,
      template: path.resolve(__dirname, "./example/index.html")
    })
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

if (isdev) {
  config.devServer = {
    contentBase: path.join(__dirname, "dist/"),
    // hot: true,
    open: true,
    overlay: true,
    inline: true,
    contentBase: false,
    compress: true,
    host: "localhost",
    port: 9999,
    open: true
  };
}

module.exports = config;

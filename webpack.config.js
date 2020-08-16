const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const isRunningDevServer = process.env.WEBPACK_DEV_SERVER
module.exports = {
  entry: [
    path.join(__dirname, 'src/main.js'),
  ],
  output: {
    filename: 'js/[name].[contenthash].js',
    publicPath: '/'
  },
  plugins: [
    // ...(
    //   isRunningDevServer
    //   ? []
    //   : 
    // ),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      }, 
      {
        test: /\.(png|jpg|jpeg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
          outputPath: 'assets/img'
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
    }
  }
}
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  stats: 'node',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
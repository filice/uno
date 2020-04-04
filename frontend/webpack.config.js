const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ],
      },
      {
        test: /\.html$/,
        use: [ 'html-loader' ],
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [ 'file-loader' ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 8080,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        secure: false,
        ws: true,
      },
    },
  },
};

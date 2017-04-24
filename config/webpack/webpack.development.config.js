var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, '../../'),
  entry: {
    'translate-flip': './src'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.css']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    })
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devtool: 'inline-source-map'
};

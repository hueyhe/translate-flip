var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, '../../'),
  entry: {
    'translate-flip': './src'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, '../../dist'),
    library: 'translate-flip',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.json', '.css']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      },
      sourceMap: false
    })
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devtool: 'hidden-source-map'
};

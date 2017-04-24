var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, '../../'),
  entry: {
    'translate-flip': './src'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, '../../dist')
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
  devtool: 'hidden-source-map'
};

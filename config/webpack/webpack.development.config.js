var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, '../../'),
  entry: {
    'translate-flip': './src',
    'demo': './src/demo.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.css']
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devServer: {
    contentBase: [path.join(__dirname, '../../demo'), path.join(__dirname, '../../dist')],
    host: '0.0.0.0',
    port: 4619,
    hot: true,
    publicPath: 'http://0.0.0.0:4619/dist/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'inline-source-map'
};

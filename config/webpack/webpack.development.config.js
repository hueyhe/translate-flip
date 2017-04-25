var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, '../../'),
  entry: {
    'translate-flip': ['babel-polyfill', './src'],
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
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
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
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: path.resolve(__dirname, '../../.eslintrc.js')
        }
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'inline-source-map'
};

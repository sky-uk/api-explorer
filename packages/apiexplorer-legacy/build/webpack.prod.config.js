var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var rootPath = path.join(__dirname, '..')
var srcPath = path.join(rootPath, 'src')
var distPath = path.join(rootPath, 'dist')

module.exports = {
  devtool: 'source-map',
  entry: {
    main: srcPath
  },
  output: {
    path: distPath,
    filename: 'APIExplorer.umd.js',
    publicPath: '/',
    library: 'APIExplorer',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.IgnorePlugin(/^(buffertools)$/), // unwanted "deeper" dependency
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(rootPath, 'build', 'index-template.html')
    })
  ],
  resolve: {
    modulesDirectories: [
      srcPath,
      'node_modules'
    ]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: rootPath
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: rootPath
    }]
  }
}

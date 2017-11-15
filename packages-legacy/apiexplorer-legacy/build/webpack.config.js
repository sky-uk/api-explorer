var path = require('path')
var webpack = require('webpack')

var sample = process.env.APIEXPLORER_SAMPLE
var rootPath = path.join(__dirname, '..')
var srcPath = path.join(rootPath, 'src')
var distPath = path.join(rootPath, 'dist')
var samplePath = path.join(rootPath, 'sampleapp', sample)

if (!sample) {
  throw Error('You need to specify a APIEXPLORER_SAMPLE env variable with the sample folder name')
}

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    samplePath
  ],
  output: {
    path: distPath,
    filename: 'apiexplorer.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new webpack.IgnorePlugin(/^(buffertools)$/), // unwanted "deeper" dependency
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.NoErrorsPlugin()
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

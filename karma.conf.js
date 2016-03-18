// var path = require('path'); 

module.exports = function(config) {
  config.set({ 
    frameworks: ['mocha', 'chai-sinon'],
    reporters: ['mocha'],
    browsers: ['PhantomJS'],

    files: [
      'test/**/*.spec.js',
    ],
    preprocessors: {
      'test/**/*.js': ['webpack'],
      'src/**/*.js': ['webpack'],
      '**/*.js': ['sourcemap'],
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
          }
        ]
      },// end of module
      resolve: {
        modulesDirectories: [__dirname, 'node_modules'],
      },
      webpackMiddleware: {
        noInfo: true,
      },
    }, // end of webpack
  })
}
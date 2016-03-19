// var path = require('path'); 

module.exports = function(config) {
  config.set({ 
    autoWatchBatchDelay: 500,
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
      // https://github.com/MoOx/eslint-loader
      // eslint options
      eslint: {
        fix: false
      },
      module: {
        // preLoaders: [{
        //   // only process .js or .jsx file
        //   test: /\.jsx?$/,
        //   // ignore any file from node_modules
        //   exclude: /node_modules|dist|build|demo|doc/,
        //   // include: path.join(__dirname, "src"),
        //   // use eslint for linting(syntax checking),
        //   // if you follow along, that will make sure our code style unified
        //   loaders: ["eslint-loader"],
        // }],
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
    }, // end of webpack
    webpackMiddleware: {
      noInfo: true
    },
  })
}
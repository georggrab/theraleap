var webpackConfig = require('./webpack.config.js');
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'Y'
process.env.CHROME_BIN = '/usr/bin/chromium'

module.exports = function (config) {
  config.set({
    // Paths
    basePath: '',
    exclude: [],
    files: [
      {pattern: 'src/**/*.test.ts', watch: true},
    ],
    
    // Module processing
    preprocessors: {
      // Process all *test* modules with webpack 
      // (it will handle dependencies)
      'src/**/*.test.ts': ['webpack', 'sourcemap'],
    },

    browsers: ['ChromeHeadless'],
    // Reporters
    reporters: ['dots'],
    logLevel: config.LOG_INFO,
    colors: true,

    frameworks: ['mocha'],

    // Runner configuration
    port: 9876,
    autoWatch: true,
    concurrency: Infinity,
    
    mime: {
        'text/x-typescript': ['ts','tsx']
    },

/* OTHER CONFIGURATION */

    // Webpack config
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
  });
};
// Karma configuration
// Generated on Mon Nov 03 2014 22:08:30 GMT-0700 (Mountain Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/Scripts/angular.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/Scripts/angular-route.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/Scripts/angular-animate.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/Scripts/loading-bar.min.js',  
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/Scripts/angular-local-storage.min.js',  
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/Scripts/angular-mocks.js',	 
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/app/app.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/services/authinterceptorservice.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/services/authservice.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/services/abstractsservice.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/app/nav/indexcontroller.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/app/nav/homecontroller.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/app/auth/logincontroller.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/app/auth/signupcontroller.js',
	  'ConSova.OCV.ngUI/ConSova.OCV.ngUI/app/client/clientctrl.js',
      'ConSova.OCV.ngUI.Tests/ng-tests/*Spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'html'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};

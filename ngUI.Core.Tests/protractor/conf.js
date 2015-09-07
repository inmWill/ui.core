var HtmlReporter = require('protractor-html-screenshot-reporter');
var path = require('path');

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // baseUrl: 'http://ocv_development/', 
    baseUrl: 'http://localhost:55792/',
    specs: ['./**/*.spec.js'],
    
    suites:{
        auth: './auth/*.spec.js',
        user: './user/*.spec.js',
        full: './**/*.spec.js'
    },

    onPrepare: function() {
        // Add a screenshot reporter and store screenshots to `/AutomatedTests/OCV/protractor/screenshots`:
        jasmine.getEnv().addReporter(new HtmlReporter({
            capabilities: {
                'browserName': 'chrome'
            },
            baseDirectory: '/AutomatedTests/OCV/protractor/screenshots',
            preserveDirectory: true,
            takeScreenShotsOnlyForFailedSpecs: true,
        pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {

            var monthMap = {
                "1": "Jan",
                "2": "Feb",
                "3": "Mar",
                "4": "Apr",
                "5": "May",
                "6": "Jun",
                "7": "Jul",
                "8": "Aug",
                "9": "Sep",
                "10": "Oct",
                "11": "Nov",
                "12": "Dec"
            };

            var currentDate = new Date(),
                currentHoursIn24Hour = currentDate.getHours(),
                currentTimeInHours = currentHoursIn24Hour > 12 ? currentHoursIn24Hour - 12 : currentHoursIn24Hour,
                totalDateString = currentDate.getDate() + '-' + monthMap[currentDate.getMonth() + 1] + '-' + (currentDate.getYear() + 1900) +
                                      '-' + currentTimeInHours + 'h-' + currentDate.getMinutes() + 'm';

            return path.join(totalDateString, capabilities.caps_.browserName, descriptions.join('-'));
        }
    }));
}
};
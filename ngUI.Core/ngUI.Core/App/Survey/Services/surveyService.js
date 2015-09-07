(function () {
    'use strict';

    angular
        .module('core.survey')
        .factory('surveyService', surveyService);

    surveyService.$inject = ['$http', 'APP_CONFIG'];

    function surveyService($http, APP_CONFIG) {

        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getSurveyByActiveUser: getSurveyByActiveUser,
            getQuestion: getQuestion,
            saveAnswer: saveAnswer
        };

        return service;

        function getSurveyByActiveUser() {
            return $http.get(serviceBase + 'api/Survey/GetSurveyByActiveUser');
        }

        function getQuestion(questionId) {
            return $http.get(serviceBase + 'api/Question/GetMockQuestion?id=' + questionId);
        }

        function saveAnswer(answer) {
            return $http.post(serviceBase + 'api/Answer/post', answer);
        }

    }
})();
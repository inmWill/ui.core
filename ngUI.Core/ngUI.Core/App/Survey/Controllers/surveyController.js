(function () {
    'use strict';

    angular
        .module('core.survey')
        .controller('surveyController', surveyController);

    surveyController.$inject = ['$state', '$stateParams', 'surveyService', '$scope', '$filter'];

    function surveyController($state, $stateParams, surveyService, $scope, $filter) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'surveyController';
        vm.questionId = $stateParams.questionId;
        vm.user = $scope.userData.profile.ClientEmployee;
        vm.user.spouse = $filter('filter')(vm.user.Dependents, { Spouse: "true" })[0];
        vm.user.spouse.DependentType = "Spouse";
        vm.currentslide = '66666666';
        vm.progress = 10;
        vm.surcharge = true;
        vm.surveyState = "Initial";
        vm.survey = {};

        activate();

        function activate() {
            getActiveSurvey();
            if (vm.questionId != "") {
                return getActiveQuestion(vm.questionId).then(function() {
                    vm.surveyState = "Question";
                });
            } else {
                
            }
        };

        function getActiveSurvey() {
            surveyService.getSurveyByActiveUser()
                .success(function (data) {
                    vm.survey = data;

                })
                .error(function (error) {
                    
                });
        }

        function getActiveQuestion(questionId) {
            return surveyService.getQuestion(questionId)
                .success(function(data) {
                    vm.activeQuestion = data;
                    return vm.activeQuestion;
                })
                .error(function(error) {
                    $state.go('survey', { questionId: 1 });
                });
        }

        vm.activeQuestion = {};

        vm.startSurvey = function() {
            $state.go('survey', { questionId: 1 });
        };

        vm.submitAnswer = function (answerId, nextId, action) {
            surveyService.saveAnswer(answerId)
                .success(function (data) {
                    if (action === "") {
                        $state.go('survey', { questionId: nextId });
                    } else {
                        processAction(action);
                    }
                })
                .error(function (error) {
                    $state.go('survey', { questionId: nextId });
                });

        };

        function processAction(action) {
            switch (action) {
                case "SurveyComplete":
                    vm.surveyState = "Complete";
                    break;
                case "StartOver":
                    $state.go('survey', { questionId: 1 });
                    break;               
            }
        }

        vm.changeSlide = function(slidenum) {
            vm.currentslide = slidenum;

            vm.progress = slidenum * 12;

            if (slidenum === '99') {
                vm.surcharge = false;
                vm.progress = 90;
            }

            if (slidenum === '999') {
                vm.progress = 100;
            }

            if (slidenum === '9999') {
                vm.progress = 100;
            }

        };
    }
})();

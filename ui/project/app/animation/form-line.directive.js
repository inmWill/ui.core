(function () {
    'use strict';

    angular
        .module('app.animation')
        .directive('fgLine', fgLine);

    //fgLine.$inject = ['$window'];

    function fgLine() {
        // Usage:
        //     <div class="fg-line"></div>
        // Creates:
        //  Animates input  bottom border
        var directive = {
            link: link,
            restrict: 'C'
        };
        return directive;

        function link(scope, element, attrs) {
            if ($('.fg-line')[0]) {
                $('body').on('focus', '.form-control', function () {
                    $(this).closest('.fg-line').addClass('fg-toggled');
                });

                $('body').on('blur', '.form-control', function () {
                    var p = $(this).closest('.form-group');
                    var i = p.find('.form-control').val();

                    if (p.hasClass('fg-float')) {
                        if (i.length === 0) {
                            $(this).closest('.fg-line').removeClass('fg-toggled');
                        }
                    }
                    else {
                        $(this).closest('.fg-line').removeClass('fg-toggled');
                    }
                });
            }
        }
    }

})();







//.directive('fgLine', function(){
//    return {
//        restrict: 'C',
//        link: function(scope, element) {
//            if($('.fg-line')[0]) {
//                $('body').on('focus', '.form-control', function(){
//                    $(this).closest('.fg-line').addClass('fg-toggled');
//                })

//                $('body').on('blur', '.form-control', function(){
//                    var p = $(this).closest('.form-group');
//                    var i = p.find('.form-control').val();

//                    if (p.hasClass('fg-float')) {
//                        if (i.length == 0) {
//                            $(this).closest('.fg-line').removeClass('fg-toggled');
//                        }
//                    }
//                    else {
//                        $(this).closest('.fg-line').removeClass('fg-toggled');
//                    }
//                });
//            }

//        }
//    }

//})
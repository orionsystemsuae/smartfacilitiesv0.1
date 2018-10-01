(function () {
    'use strict';

    angular
        .module('app')
        .directive('exampleDirective', exampleDirective)

    function exampleDirective() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/common/settingsGrid.tpl.html',


            link: function (scope, elm, attrs) {
                scope.$watch('config', function (newValue, oldValue) {
                    //scope.$parent.outerVal = scope.valThroughAt;
                    if(newValue != undefined)
                    {
                        console.log('newValue1', scope.$eval(newValue));
                        scope.settings = scope.$eval(newValue);
                        console.log('newValue2', scope.settings);

                    }
                });
                scope.$watch('settings', function (newValue, oldValue) {
                    //scope.$parent.outerVal = scope.valThroughAt;
                    if(newValue != undefined)
                    {
                        console.log('newSettings', newValue);
                       // scope.settings = scope.$eval(newValue);
                       // console.log('newValue2', scope.settings);

                    }
                });
            },
            transclude: true,
            scope: {
                config: '='
            },

        }
    }
})();

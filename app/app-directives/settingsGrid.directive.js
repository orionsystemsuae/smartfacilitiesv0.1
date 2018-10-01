(function () {
    'use strict';

    angular
        .module('app')
        .directive('settingsGrid', settingsGrid)

    function settingsGrid(FlashService) {
        // return {
        //     restrict: 'E',
        //     replace: true,
        //     templateUrl: 'partials/common/settingsGrid.tpl.html',
        //     link: function (scope, elm, attrs) {
        //         console.log('directive1', attrs);
        //         console.log('directive2', attrs.settings);
        //         scope.settings = scope.$eval(attrs.settings); 
        //         console.log('directive3', scope.settings);
        //     }
        // }

        return {
            restrict: 'EA',
            scope: {
                settings: '=',
            },
            replace: true,
            templateUrl: 'partials/common/settingsGrid.tpl.html',
            link: function (scope, elm, attrs) {
            }
        }
    }
})();

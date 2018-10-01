(function () {
    'use strict';

    angular
        .module('app')
        .directive('widgetChartTile', widgetChartTile);

    function widgetChartTile(FlashService, MqttClient) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'partials/widgets/widgetChartTile.tpl.html',
        }
    }
})();

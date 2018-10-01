(function () {
    'use strict';

    angular
        .module('app')
        .directive('widgetInformationTile', widgetInformationTile)
        .directive('widgetInformationBoard', widgetInformationBoard)
        .directive('widgetInfoRazorTile', widgetInfoRazorTile)
        .directive('widgetLabelIcon', widgetLabelIcon);

    function widgetInformationTile(FlashService, MqttClient) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'partials/widgets/widgetInformationTile.tpl.html',
        }
    }

    function widgetInfoRazorTile(FlashService, MqttClient) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'partials/widgets/widgetInfoRazorTile.tpl.html',
        }
    }

    function widgetInformationBoard(FlashService, MqttClient) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'partials/widgets/widgetInformationBoard.tpl.html',
        }
    }

    function widgetLabelIcon(FlashService, MqttClient) {
        return {
            restrict: 'E',
            replace: true,
            template: '<b>sdf</b>',
            link: function (scope, elm, attrs) {
                elm.bind('click', function (event) {
                    console.log(attrs);
                    FlashService.Success('Hello');
                    alert("You pressed button: " + event.target.getAttribute('attr1'));
                });
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .directive('widgetHmiTile', widgetHmiTile)
        .directive('widgetHmiSettingsModal', widgetHmiSettingsModal)
        // .directive('hmiButtonCtrl', hmiButtonCtrl)
        .directive('hmiIcon', hmiIconCtrl);

    function widgetHmiTile(FlashService, MqttClient, HmiFactory) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: "=",
                subscribedTopics: "="
            },
            templateUrl: 'partials/widgets/widgetHmiTile.tpl.html',
            link: function ($scope, $element, $attrs) {
                // $element.on('click', function () {
                //     console.log($element);
                //     console.log($(this));

                //     var clickedBtnID = $(this).attr('id'); // or var clickedBtnID = this.id
                //     alert('you clicked on button #' + clickedBtnID);
                // });

                //console.log('$scope', $scope);
                //console.log('$attrs', $attrs);
                //add object
                // $scope.AddObject = function (objectTypeId) {
                //     $scope.ngModel = HmiFactory.AddObject($scope.ngModel, objectTypeId);
                // };
            }
        }
    }

    function widgetHmiSettingsModal() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/widgets/widgetHmiSettingsModal.tpl.html'
        }
    }

    function hmiIconCtrl(FlashService, MqttClient) {
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

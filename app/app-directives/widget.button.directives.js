(function () {
    'use strict';

    angular
        .module('app')
        .directive('widgetButtonSimple', widgetButtonSimple)
        .directive('widgetButtonOnOffSlide', widgetButtonOnOffSlide)

        .directive('pieCharta', peityPieChartDirective)
        .directive('barCharta', barChartDirective)
        .directive('lineCharta', lineChartDirective);

    function widgetButtonSimple(FlashService, MqttClient) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="btn btn-primary btn-block">Click Me!</div>',
            link: function(scope, elm, attrs) {
                elm.bind('click', function(event) {
                    console.log(attrs);
                    FlashService.Success('Hello');
                    alert("You pressed button: " + event.target.getAttribute('attr1'));
                });}
        }
    }

    function widgetButtonOnOffSlide(FlashService, MqttClient) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="btn btn-primary btn-block">Click Me!</div>',
            link: function(scope, elm, attrs) {
                elm.bind('click', function(event) {
                    console.log(attrs);
                    FlashService.Success('Hello');
                    alert("You pressed button: " + event.target.getAttribute('attr1'));
                });}
        }
    }

    var buildChartDirective = function (chartType) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                data: "=",
                options: "="
            },
            link: function (scope, element, attrs) {

                var options = {};

                if (scope.options) {
                    options = scope.options;
                }

                var span = document.createElement('span');
                span.style.display = "none";
                span.textContent = scope.data.join();

                if (!attrs.class) {
                    span.className = "";
                } else {
                    span.className = attrs.class;
                }

                if (element[0].nodeType === 8) {
                    element.replaceWith(span);
                } else {
                    element[0].appendChild(span);
                }

                jQuery(span).peity(chartType, options);

                var watcher = scope.$watch('data', function () {
                    span.textContent = scope.data.join();
                    jQuery(span).change();
                }, true);

                scope.$on('$destroy', function () {
                    watcher();
                });

                jQuery(window).resize(function () {
                    jQuery(span).peity(chartType, options);
                });

            }
        };
    };



    function peityPieChartDirective() {
        return buildChartDirective("pie");
    }

    function barChartDirective() {
        return buildChartDirective("bar");
    }

    function lineChartDirective() {
        return buildChartDirective("line");
    }


})();

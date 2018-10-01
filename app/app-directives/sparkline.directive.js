(function () {
    'use strict';

    angular
        .module('app')
        .directive('jqSparklineTest', jqSparklineTest)
        .directive('jqSparkline', jqSparkline);

    function jqSparklineTest() {
        return {
            restrict: 'EA',
            replace: true,
            template: '<b>Click me to go to Google</b>'
        }
    }
    function jqSparkline() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                //console.log("attrs", attrs);
                var opts = {};
                //TODO: Use $eval to get the object
                opts.type = attrs.type || 'line';

                scope.$watch(attrs.ngModel, function () {
                    render();
                }, true);

                scope.$watch(attrs.opts, function () {
                    render();
                });
                var render = function () {
                    var model;
                    if (attrs.opts) angular.extend(opts, angular.fromJson(attrs.opts));
                    //console.log(opts);
                    // Trim trailing comma if we are a string
                    angular.isString(ngModel.$viewValue) ? model = ngModel.$viewValue.replace(/(^,)|(,$)/g, "") : model = ngModel.$viewValue;
                    var data;
                    // Make sure we have an array of numbers
                    //console.log('model', model);
                    angular.isArray(model) ? data = model : data = model.split(',');
                    $(elem).sparkline(data, opts);
                };
            }
        }
    }
})();

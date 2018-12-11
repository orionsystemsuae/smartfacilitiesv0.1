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
            link: function (scope, element, attrs) {
                console.log('****************');
                console.log(attrs.areauuid);
                console.log(attrs.type);
                //load firsttime
                var urlStr = "";

                if (attrs.type == "WC")
                    urlStr = "https://smartfacilitiesv1.azurewebsites.net/api/v1/widgets/cubicalsVisitorsDaily.getHourlyBreakup?areauuid=" + attrs.areauuid;
                else if (attrs.type == "WB")
                    urlStr = "https://smartfacilitiesv1.azurewebsites.net/api/v1/widgets/washbasinsVisitorsDaily.getHourlyBreakup?areauuid=" + attrs.areauuid;
                else if (attrs.type == "UR")
                    urlStr = "https://smartfacilitiesv1.azurewebsites.net/api/v1/widgets/urinalsVisitorsDaily.getHourlyBreakup?areauuid=" + attrs.areauuid;

                $.get(urlStr, function (data) {
                    console.log('****************');
                    for (let i = 0; i < data.length; i++) {
                        var point = { "x": data[i].hour, "top-1": data[i].count };
                        console.log(point);
                        if (attrs.type == "WC")
                            scope.datapointsWC.push(point);
                        else if (attrs.type == "WB")
                            scope.datapointsWB.push(point);
                        else if (attrs.type == "UR")
                            scope.datapointsUR.push(point);
                    }
                });

                //reload 5 minutes
                setInterval(function () {
                    $.get(urlStr, function (data) {
                        console.log('****************');
                        scope.datapointsWC = [];
                        scope.datapointsWB = [];
                        scope.datapointsUR = [];

                        for (let i = 0; i < data.length; i++) {
                            var point = { "x": data[i].hour, "top-1": data[i].count };
                            console.log(point);
                            if (attrs.type == "WC")
                                scope.datapointsWC.push(point);
                            else if (attrs.type == "WB")
                                scope.datapointsWB.push(point);
                            else if (attrs.type == "UR")
                                scope.datapointsUR.push(point);
                        }
                    });
                }, 60000 * 5);


                //reload 5 minutes
                // setInterval(function(){                   
                //     var aDate = new Date(); //dateFilter(new Date(),'yyyy-MM-dd hh:mm:ss');
                //     var data = {"x": aDate, "top-1": Math.floor((Math.random() * 200) + 1), "top-2": Math.floor((Math.random() * 200) + 1)}; 
                //     scope.datapoints.push(data);
                // console.log(scope.datapoints);
                // }, 10000);
            }
        }

    }
})();

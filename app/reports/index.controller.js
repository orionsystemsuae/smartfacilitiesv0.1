(function () {
    'use strict';

    angular
        .module('app')
        .controller('Reports.IndexController', Controller);

    function Controller($rootScope, $scope, UserService) {
        var vm = this;
        vm.user = null;
        vm.currentDate = moment(new Date());
        vm.reportSummary = true;
        vm.reportWC = false;
        vm.reportWB = false;
        vm.reportUR = false;

        vm.filterExpanded = true;
        vm.isReportLoading = false;
        vm.isReportWBLoading = false;
        vm.isReportWCLoading = false;
        vm.isReportURLoading = false;

        vm.isReportGenerated = false;
        vm.isReportWBGenerated = false;
        vm.isReportWCGenerated = false;
        vm.isReportURGenerated = false;

        vm.datapoints = [];
        vm.datapointsWC = [];
        vm.datapointsWB = [];
        vm.datapointsUR = [];

        vm.datacolumns = [{ "id": "top-1", "type": "bar", "name": "All Facilities" }];
        vm.datacolumnsWC = [{ "id": "top-1", "type": "bar", "name": "Water Closets" }];
        vm.datacolumnsWB = [{ "id": "top-1", "type": "bar", "name": "Washbasins" }];
        vm.datacolumnsUR = [{ "id": "top-1", "type": "bar", "name": "Urinals" }];

        vm.datax = { "id": "x" };
        //methods
        vm.generateAllFacilitiesReport = generateAllFacilitiesReport;
        initController();

        function initController() {
            console.log("Report controller init");
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;
                vm.user = {};
            });
        }

        function generateAllFacilitiesReport() {
            // var urlStr = "https://smartfacilitiesv1.azurewebsites.net/api/v1/widgets/urinalsVisitorsDaily.getHourlyBreakup?areauuid=" + 'ar2f3772d213';
            // $.get(urlStr, function (data) {
            //     console.log(data);
            //     for (let i = 0; i < data.length; i++) {
            //         var point = { "x": data[i].hour, "top-1": data[i].count };
            //         console.log(point);
            //         vm.datapoints.push(point);
            //     }
            // });

            // initilize - refresh
            vm.isReportLoading = false;
            vm.isReportWBLoading = false;
            vm.isReportWCLoading = false;
            vm.isReportURLoading = false;

            vm.isReportGenerated = false;
            vm.isReportWBGenerated = false;
            vm.isReportWCGenerated = false;
            vm.isReportURGenerated = false;

            //All Facilities
            if (vm.reportSummary) {
                vm.isReportLoading = true;
                vm.isReportGenerated = false;
                var urlStr = "https://smartfacilitiesv1.azurewebsites.net/api/v1/widgets/allFacilityTypeVisitorsDaily.getTotal?areauuid=" + vm.area + '&startdate=' + vm.currentDate.format('MM/DD/YYYY') + '&enddate=' + vm.currentDate.format('MM/DD/YYYY');
                console.log(urlStr);
                $.get(urlStr, function (data) {
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        var point = { "x": data[i].facilitytypename, "top-1": data[i].count };
                        console.log(point);
                        vm.datapoints.push(point);
                    }
                    vm.isReportLoading = false;
                    vm.isReportGenerated = true;
                });
            }

            //All Cubicles
            if (vm.reportWC) {
                vm.isReportWCLoading = true;
                vm.isReportWCGenerated = false;
                var urlStr =  'https://smartfacilitiesv1.azurewebsites.net/api/v1/widgets/allFacilitiesVisitorsDaily.getTotal?areauuid=' + vm.area + '&startdate=' + vm.currentDate.format('MM/DD/YYYY') + '&enddate=' + vm.currentDate.format('MM/DD/YYYY') + '&facilitytypes=' + 'WCE,WCA,WCEA,WCAA';
                $.get(urlStr, function (data) {
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        var point = { "x": data[i].facilitytypename, "top-1": data[i].count };
                        console.log(point);
                        vm.datapointsWC.push(point);
                    }
                    vm.isReportWCLoading = false;
                    vm.isReportWCGenerated = true;
                });
            }

            //All Washbasins
            if (vm.reportWB) {
                vm.isReportWBLoading = true;
                vm.isReportWBGenerated = false;
                var urlStr =  'https://smartfacilitiesv1.azurewebsites.net/api/v1/widgets/allFacilitiesVisitorsDaily.getTotal?areauuid=' + vm.area + '&startdate=' + vm.currentDate.format('MM/DD/YYYY') + '&enddate=' + vm.currentDate.format('MM/DD/YYYY') + '&facilitytypes=' + 'WB,WBK';
                $.get(urlStr, function (data) {
                    for (let i = 0; i < data.length; i++) {
                        var point = { "x": data[i].facilitytypename, "top-1": data[i].count };
                        vm.datapointsWB.push(point);
                    }
                    vm.isReportWBLoading = false;
                    vm.isReportWBGenerated = true;
                });
            }

            //All Urinals
            if (vm.reportUR) {
                vm.isReportURLoading = true;
                vm.isReportURGenerated = false;
                var urlStr =  'https://smartfacilitiesv1.azurewebsites.net/api/v1/widgets/allFacilitiesVisitorsDaily.getTotal?areauuid=' + vm.area + '&startdate=' + vm.currentDate.format('MM/DD/YYYY') + '&enddate=' + vm.currentDate.format('MM/DD/YYYY') + '&facilitytypes=' + 'UR';
                $.get(urlStr, function (data) {
                    for (let i = 0; i < data.length; i++) {
                        var point = { "x": data[i].facilitytypename, "top-1": data[i].count };
                        vm.datapointsUR.push(point);
                    }
                    vm.isReportURLoading = false;
                    vm.isReportURGenerated = true;
                });
            }
        }
    }



})();
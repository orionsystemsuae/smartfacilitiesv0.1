(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($scope, $window, HmiFactory) {
        var vm = this;
       
        $scope.datePicker = {};
        $scope.datePicker.options = {
            applyClass: 'btn-primary',
            startDate: moment().startOf('day'),
            endDate: moment().endOf('day'),
            timePicker: true,
            timePicker24Hour: true,
            timePickerSeconds: true,
            locale: {
                applyLabel: "Apply",
                fromLabel: "From",
                format: "YYYY-MM-DD HH:mm:ss", //will give you 2017-01-06
                //format: "YYYY-MM-DD", //will give you 2017-01-06
                //format: "D-MMM-YY", //will give you 6-Jan-17
                //format: "D-MMMM-YY", //will give you 6-January-17
                toLabel: "To",
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            linkedCalendars: false,
            autoUpdateInput: true,
            alwaysShowCalendars: true,
            showWeekNumbers: true,
            showDropdowns: true,
            showISOWeekNumbers: true
        }
        $scope.datePicker.date = { startDate: null, endDate: null };

        

        initController();

        function initController() {
           console.log("Home controller init");
        }
    }
})();
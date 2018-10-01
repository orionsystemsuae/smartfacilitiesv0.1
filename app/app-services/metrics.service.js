(function () {
    'use strict';

    angular
        .module('app')
        .factory('MetricsService', Service);

    function Service($http, $q) {
        var service = {};
        service.GetSeries = GetSeries;
        return service;

        function GetSeries(topicAddress, timeStart, timeEnd, frequency) {
            var url = '/api/metrics/series?topic=' + topicAddress + '&frequency=' + frequency + '&timeStart=' + timeStart + '&timeEnd=' + timeEnd;
            //console.log(url);
            return $http.get('/api/metrics/series?topic=' + topicAddress + '&frequency=' + frequency + '&timeStart=' + timeStart + '&timeEnd=' + timeEnd).then(handleSuccess, handleError);
        }

        // function Create(dashboard) {
        //     return $http.post('/api/dashboards/', dashboard).then(handleSuccess, handleError);
        // }

        //private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();

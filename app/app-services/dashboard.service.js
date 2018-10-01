(function () {
    'use strict';

    angular
        .module('app')
        .factory('DashboardService', Service);

    function Service($http, $q) {
        var service = {};
        service.GetAll = GetAll;
        service.GetPrivateByUserId = GetPrivateByUserId;
        service.GetSharedByUserId = GetSharedByUserId;

        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/dashboards').then(handleSuccess, handleError);
        }

        function GetPrivateByUserId(userId) {
            return $http.get('/api/dashboards?createdBy=' + userId + '&type=private').then(handleSuccess, handleError);
        }

        function GetSharedByUserId(userId) {
            return $http.get('/api/dashboards?createdBy=' + userId + '&type=shared').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/dashboards/' + _id).then(handleSuccess, handleError);
        }

        function Create(dashboard) {
            return $http.post('/api/dashboards/', dashboard).then(handleSuccess, handleError);
        }

        function Update(dashboard) {
            return $http.put('/api/dashboards/' + dashboard._id, dashboard).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/dashboards/' + _id).then(handleSuccess, handleError);
        }

        //private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();

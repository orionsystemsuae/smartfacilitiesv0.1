(function () {
    'use strict';

    angular
        .module('app')
        .factory('FacilityService', Service);

    function Service($http, $q) {
        var service = {};
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/facilities').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/facilities/' + _id).then(handleSuccess, handleError);
        }

        function Create(facility) {
            return $http.post('/api/facilities/', facility).then(handleSuccess, handleError);
        }

        function Update(facility) {
            return $http.put('/api/facilities/' + facility._id, facility).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/facilities/' + _id).then(handleSuccess, handleError);
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

(function () {
    'use strict';

    angular
        .module('app')
        .factory('ClientService', Service);

    function Service($http, $q) {
        var service = {};
        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetCurrent() {
            return $http.get('/api/clients/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/clients').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/clients/' + _id).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/clients/', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/clients/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/clients/' + _id).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();

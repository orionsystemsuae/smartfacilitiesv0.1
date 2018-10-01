(function () {
    'use strict';

    angular
        .module('app')
        .factory('SiteService', Service);

    function Service($http, $q) {
        var service = {};
        service.GetAll = GetAll;
        service.GetAllByClientId = GetAllByClientId;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/sites').then(handleSuccess, handleError);
        }

        function GetAllByClientId(_id) {
            return $http.get('/api/sites?oid='+_id).then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/sites/' + _id).then(handleSuccess, handleError);
        }

        function Create(site) {
            return $http.post('/api/sites/', site).then(handleSuccess, handleError);
        }

        function Update(site) {
           return $http.put('/api/sites/' + site._id, site).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/sites/' + _id).then(handleSuccess, handleError);
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

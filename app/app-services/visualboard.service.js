(function () {
    'use strict';

    angular
        .module('app')
        .factory('VisualboardService', Service);

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
            return $http.get('/api/visualboards').then(handleSuccess, handleError);
        }

        function GetPrivateByUserId(userId) {
            return $http.get('/api/visualboards?createdBy=' + userId + '&type=private').then(handleSuccess, handleError);
        }

        function GetSharedByUserId(userId) {
            return $http.get('/api/visualboards?createdBy=' + userId + '&type=shared').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/visualboards/' + _id).then(handleSuccess, handleError);
        }

        function Create(visualboard) {
            return $http.post('/api/visualboards/', visualboard).then(handleSuccess, handleError);
        }

        function Update(visualboard) {
            return $http.put('/api/visualboards/' + visualboard._id, visualboard).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/visualboards/' + _id).then(handleSuccess, handleError);
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

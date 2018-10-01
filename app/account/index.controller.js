(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($rootScope, $scope, UserService, FlashService, ClientService) {
        var vm = this;
        vm.loggedInUser = null;
        vm.updateUser = updateUser;
        vm.updatePhoto = updatePhoto;

        initController();

        function initController() {
            console.log("Account controller init");
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;

                //load all clients
                GetAllClients();
            });
        }

        function GetAllClients() {
            ClientService.GetAll()
                .then(function (clients, res) {
                    vm.clients = clients;
                    console.log(vm.clients);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function updatePhoto(event)
        {
            var files = event.target.files;
            var file = files[files.length - 1];
            var reader = new FileReader();
            reader.onload = function(event) {
                $scope.$apply(function() {
                    vm.loggedInUser.profileImage = event.target.result;
                });
            }
            reader.readAsDataURL(file);
        }

        function updateUser() {
            UserService.Update(vm.loggedInUser)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }
})();
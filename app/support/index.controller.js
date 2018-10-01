(function () {
    'use strict';

    angular
        .module('app')
        .controller('Support.IndexController', Controller);

    function Controller($rootScope, UserService) {
        var vm = this;
        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;
                vm.user = {};
            });
        }
    }

})();
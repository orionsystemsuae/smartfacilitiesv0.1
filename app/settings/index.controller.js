(function () {
    'use strict';

    angular
        .module('app')
        .controller('Settings.IndexController', Controller);

    function Controller($rootScope, UserService) {
        var vm = this;
        vm.user = null;

        initController();

        function initController() {
            console.log("Settings controller init");
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;
                console.log('settings', $rootScope);
                vm.user = {};
            });
        }
    }

})();
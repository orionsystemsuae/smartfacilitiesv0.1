(function () {
    'use strict';

    angular
        .module('app')
        .controller('Logic.IndexController', Controller);

    function Controller($rootScope, UserService) {
        var vm = this;

        initController();

        function initController() {
            console.log("Logic controller init");
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;
            });
        }
    }

})();
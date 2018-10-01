(function () {
    'use strict';

    angular
        .module('app')
        .controller('Themes.IndexController', Controller);

    function Controller($rootScope, UserService, FlashService) {
        var vm = this;
        vm.loggedInUser = null;
        vm.updateUserTheme = updateUserTheme;

        initController();

        function initController() {
            console.log("Themes controller init");
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;
            });
        }

        function updateUserTheme(theme) {
            //update properties
            vm.loggedInUser.modifiedBy = vm.loggedInUser.email;
            vm.loggedInUser.theme = theme;
            $rootScope.loggedInUser = vm.loggedInUser;
            console.log(vm.loggedInUser);
            console.log($rootScope.loggedInUser);

            //update user
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
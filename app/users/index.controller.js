(function () {
    'use strict';

    angular
        .module('app')
        .controller('Users.IndexController', Controller)
        .directive('ngConfirmClick', ActionConfirmDirective)
        .directive('csSelect', CheckSelectDirective);

    function Controller($rootScope, $scope, $stateParams, UserService, FlashService, ClientService) {
        //properties
        var vm = this;
        vm.itemsByPage = 5;
        vm.user = null;
        vm.users = null;
        vm.loggedInUser = null;
        vm.selectedRow = null;  // initialize our variable to null
        //methods
        vm.setClickedRow = setClickedRow;
        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.activateUser = activateUser;
        vm.submitForm  = submitForm ;

        initController();

        function initController() {
            // get current logged in user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;
                vm.user = {};

                //load all clients
                GetAllClients();

                //if id param supplied its edit else view all users
                if($stateParams._id)
                    GetUser($stateParams._id)
                else
                    GetAllUsers();
            });
        }

         //file upload functions
         vm.updatePhoto = function (event) {

            var files = event.target.files;
            var file = files[files.length - 1];
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.$apply(function () {
                    vm.user.profileImage = event.target.result;
                });
            }

            if (file) {
                reader.readAsDataURL(file);
            }
        }

        function updateUser() {
            vm.user.lastModifiedBy = vm.loggedInUser.email;
            if(vm.loggedInUser.role != 'Platform Admin.')
            {
                vm.user.organisation = vm.loggedInUser.organisation;
                vm.user.organisationId = vm.loggedInUser.organisationId;
            }

            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function createUser() {
            vm.user.createdBy = vm.loggedInUser.email;
            vm.user.lastModifiedBy = vm.loggedInUser.email;
            if(vm.loggedInUser.role != 'Platform Admin.')
            {
                vm.user.organisationId = vm.loggedInUser.organisationId;
            }

            vm.user.theme = '';
            UserService.Create(vm.user)
                .then(function () {
                    FlashService.Success('User created');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser(user) {
            var index = -1;	
            var userId = user._id;
            var usersArr = eval( vm.users );
            for( var i = 0; i < usersArr.length; i++ ) {
                if( usersArr[i]._id === userId ) {
                    index = i;
                    break;
                }
            }
            if( index === -1 ) {
                alert( "Something gone wrong" );
            }
            else
            {
                //remove user from db
                UserService.Delete(userId)
                .then(function () {
                    //remove user from grid
                vm.users.splice( index, 1 );	
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        
        }

        function activateUser(user, newStatus) {
            var index = -1;	
            var userId = user._id;
            var usersArr = eval( vm.users );
            for( var i = 0; i < usersArr.length; i++ ) {
                if( usersArr[i]._id === userId ) {
                    index = i;
                    break;
                }
            }
            if( index === -1 ) {
                alert( "Something gone wrong" );
            }
            else
            {
                //update account status in db
                user.status = newStatus;
                user.lastModifiedBy = vm.loggedInUser.email;
                UserService.Update(user)
                .then(function () {
                //update user in grid
                vm.users[index].status = newStatus;	
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        }

        function GetAllUsers() {
            if(vm.loggedInUser.role != 'Platform Admin.')
            {
                UserService.GetAllByClientId(vm.loggedInUser.organisationId)
                .then(function (users, res) { 
                    var usersArr = eval( users );
                    vm.users = usersArr;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
            else
            {
                UserService.GetAll()
                .then(function (users, res) { 
                    var usersArr = eval( users );
                    vm.users = usersArr;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        }

        function GetUser(userId) {
            UserService.GetById(userId)
                .then(function (user, res) {
                    vm.user = user;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function GetAllClients() {
            ClientService.GetAll()
                .then(function (clients, res) {
                    vm.clients = clients;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

  // function to submit the form after all validation has occurred            
  function submitForm (isValid){
        // check to make sure the form is completely valid
        if (isValid) {
            alert('our form is valid');
        }
        else
        alert('our form is invalid');
    }

    //function that sets the value of selectedRow to current index
    function setClickedRow(index){
        var vm = this;
        vm.selectedRow = index;
    }

    function ActionConfirmDirective(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }
    //custom directive for row selection and row color
    function CheckSelectDirective() {
        return {
            require: '^stTable',
            template: '<input type="checkbox"/>',
            scope: {
                row: '=csSelect'
            },
            link: function (scope, element, attr, ctrl) {
    
                element.bind('change', function (evt) {
                    scope.$apply(function () {
                        ctrl.select(scope.row, 'multiple');
                    });
                });
    
                scope.$watch('row.isSelected', function (newValue, oldValue) {
                    if (newValue === true) {
                        element.parent().addClass('st-selected');
                    } else {
                        element.parent().removeClass('st-selected');
                    }
                });
            }
        };
    }

})();
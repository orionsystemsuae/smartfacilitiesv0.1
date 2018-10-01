(function () {
    'use strict';

    angular
        .module('app')
        .controller('Clients.IndexController', Controller);

    function Controller($rootScope, $scope, $stateParams, UserService, FlashService, ClientService) {
        //properties
        var vm = this;
        vm.itemsByPage = 5;
        vm.client = {};
        vm.client.status = "true";      
        vm.client.servicePackage = "1";      

        vm.clients = null;
        vm.loggedInUser = null;
        vm.selectedRow = null;  // initialize our variable to null
        //methods
        vm.setClickedRow = setClickedRow;
        vm.createClient = createClient;
        vm.updateClient = updateClient;
        vm.deleteClient = deleteClient;
        vm.activateClient = activateClient;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;

                //if id param supplied its edit else view all clients
                if ($stateParams._id)
                {
                    GetClient($stateParams._id)}
                else
                    GetAllClients();
            });
        }

        //file upload functions
        vm.updateLogo = function (event) {
            var files = event.target.files;
            var file = files[files.length - 1];
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.$apply(function () {
                    vm.client.logo = event.target.result;
                });
            }

            if (file) {
                reader.readAsDataURL(file);
            }
        }

        function createClient() {
            ClientService.Create(vm.client)
                .then(function () {
                    FlashService.Success('Operation were successfully completed.', 'Record Create : Organisation');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function updateClient() {
            ClientService.Update(vm.client)
                .then(function () {
                    FlashService.Success('Operation were successfully completed.', 'Record Update : Organisation');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteClient(client) {
            var index = -1;
            var clientId = client._id;
            var clientsArr = eval(vm.clients);
            for (var i = 0; i < clientsArr.length; i++) {
                if (clientsArr[i]._id === clientId) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }
            else {
                //remove client from db
                ClientService.Delete(clientId)
                    .then(function () {
                        //remove client from grid
                        vm.clients.splice(index, 1);
                        FlashService.Success('Operation were successfully completed.', 'Record Delete : Organisation');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }

        }

        function activateClient(client, newStatus) {
            var index = -1;
            var clientId = client._id;
            var clientsArr = eval(vm.clients);
            for (var i = 0; i < clientsArr.length; i++) {
                if (clientsArr[i]._id === clientId) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }
            else {
                //update account status in db
                client.status = newStatus;
                ClientService.Update(client)
                    .then(function () {
                        //update client in grid
                        vm.clients[index].status = newStatus;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }

        }

        function GetAllClients() {
            if (vm.loggedInUser.role != 'Platform Admin.') {
                ClientService.GetById(vm.loggedInUser.organisationId)
                    .then(function (clients, res) {
                        vm.clients = clients;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
            else {
                ClientService.GetAll()
                    .then(function (clients, res) {
                        vm.clients = clients;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
        }

        function GetClient(clientId) {
            ClientService.GetById(clientId)
                .then(function (clients, res) {
                    vm.client = clients[0];
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }


    //function that sets the value of selectedRow to current index
    function setClickedRow(index) {
        var vm = this;
        vm.selectedRow = index;
        //console.log("row clicked: " + index);
    }

    function ActionConfirmDirective() {
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
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
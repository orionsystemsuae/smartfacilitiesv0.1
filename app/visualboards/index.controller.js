(function () {
    'use strict';

    angular
        .module('app')
        .controller('Visualboards.IndexController', Controller);

    function Controller($animate, $scope, $rootScope, $window, $stateParams, HmiFactory, VisualboardService, FlashService, UserService) {
        
        $animate.enabled(false);

        var vm = this;
        vm.itemsByPage = 5;
        vm.loadingPrivateVisualboards = true;
        vm.loadingSharedVisualboards = true;
        vm.deleteVisualboard = deleteVisualboard;
        //Helper functions
        // Check if the topic exists in user scope and has access to it
        $scope.IsTopicValid = function (topicAddress) {
            if ($rootScope.mqtt.subscribedTopics[topicAddress] != undefined)
                if ($rootScope.mqtt.subscribedTopics[topicAddress] != null)
                    return true
            //if nothing found
            return false;
        }

        // Retrieve the last updated topic value
        $scope.GetTopicValue = function (topicAddress) {
            if ($scope.IsTopicValid(topicAddress)) {
                return $rootScope.mqtt.subscribedTopics[topicAddress][0];
            }
            //if nothing found
            return 'VAL';
        }

        //CRUD Functions
        function deleteVisualboard(visualboard) {
            var index = -1;
            var visualboardId = visualboard._id;
            var visualboardsPrivateArr = eval(vm.visualboardsPrivate);
            for (var i = 0; i < visualboardsPrivateArr.length; i++) {
                if (visualboardsPrivateArr[i]._id === visualboardId) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                FlashService.Error("Operation failed. Something went wrong.", 'Visualboard : Delete');
            }
            else {
                //remove user from db
                VisualboardService.Delete(visualboardId)
                    .then(function () {
                        //remove Visualboard from grid
                        vm.visualboardsPrivate.splice(index, 1);
                        FlashService.Success("Operation was succefully completed.", 'Visualboard : Delete');
                    })
                    .catch(function (error) {
                        FlashService.Error(error, 'Visualboard : Delete');
                    });
            }
        }

        //get all visualboards
        function getAllVisualboards() {
            // if ($rootScope.loggedInUser.role != 'Platform Admin.') {

            // console.log('$rootScope', $rootScope);
            // console.log('$scope', $scope);
            // console.log($rootScope.flash);
            // console.log($rootScope.loggedInUser);
            // console.log($rootScope.mqtt);
            // debugger;

            //retrive private Visualboards
            VisualboardService.GetPrivateByUserId($rootScope.loggedInUser._id)
                .then(function (visualboardsPrivate, res) {
                    vm.visualboardsPrivate = visualboardsPrivate;
                    vm.loadingPrivateVisualboards = false;
                })
                .catch(function (error) {
                    FlashService.Error(error, 'Visualboard : Fetch - Private');
                    vm.loadingPrivateVisualboards = false;
                });

            //retrive shared Visualboards
            VisualboardService.GetSharedByUserId($rootScope.loggedInUser._id)
                .then(function (visualboardsShared, res) {
                    vm.visualboardsShared = visualboardsShared;
                    vm.loadingSharedVisualboards = false;
                })
                .catch(function (error) {
                    FlashService.Error(error, 'Visualboard : Shared');
                    vm.loadingSharedVisualboards = false;
                });
        }

        function getVisualboard(visualboardId) {
            VisualboardService.GetById(visualboardId)
                .then(function (visualboard, res) {
                    vm.hmi = visualboard;
                })
                .catch(function (error) {
                    FlashService.Error(error, 'Visualboard : Fetch');
                });
        }

        //save visualboard
        vm.saveHmi = function () {
            if (vm.hmi._id) {
                //update visualboard
                VisualboardService.Update(vm.hmi)
                    .then(function () {
                        FlashService.Success('Operation was succefully completed.', 'Visualboard : Update');
                    })
                    .catch(function (error) {
                        FlashService.Error(error, 'Visualboard : Update');
                    });
            }
            else {
                //create visualboard
                VisualboardService.Create(vm.hmi)
                    .then(function (visualboard, res) {
                        //update _id
                        vm.hmi = visualboard;
                        FlashService.Success('Operation was succefully completed.', 'Visualboard : Create');
                    })
                    .catch(function (error) {
                        FlashService.Error(error, 'Visualboard : Create');
                    });
            }
        };

        //HMI Workbench helper functions
        vm.createHmi = function (name, description, clientId, backgroundImage) {
            vm.hmi = HmiFactory.CreateHmi(name, description, clientId, backgroundImage);
        }

        vm.addObject = function (hmi, objectTypeId) {
            HmiFactory.AddObject(hmi, objectTypeId);
        }

        vm.selectObject = function (objectIndex) {
            vm.hmi.selectedObjectIndex = objectIndex;
        }

        vm.editObject = function (objectIndex) {
            vm.hmi.selectedObjectIndex = objectIndex;
            $('#modalSettings').modal('show');
        }

        vm.removeObject = function (hmi, objectIndex) {
            if (hmi.selectedObjectIndex >= 0) {
                HmiFactory.DeleteObject(hmi, objectIndex);
                hmi.selectedObjectIndex = -1;
            }
        }

        vm.duplicateObject = function (hmi, objectIndex) {
            if (hmi.selectedObjectIndex >= 0) {
                HmiFactory.DuplicateObject(hmi, objectIndex);
            }
        }

        vm.clearAllObjects = function (hmi) {
            hmi.objects.length = 0;
        }

        vm.addState = function (hmi, objectIndex) {
            HmiFactory.AddState(hmi, objectIndex);
        }

        vm.removeState = function (hmi, objectIndex, stateIndex) {
            HmiFactory.RemoveState(hmi, objectIndex, stateIndex);
        }

        vm.editStateIcon = function (hmi, objectIndex, stateIndex) {
            //console.log('editStateIcon', $window.selectedIcon);
            vm.hmi.objects[objectIndex].topic.stateTable[stateIndex].icon = $window.selectedIcon;
        }

        vm.animations = HmiFactory.GetAnimationList();

        initController();

        function initController() {

            UserService.GetCurrent().then(function (user) {
                //logged in user
                $rootScope.loggedInUser = user;

                if ($stateParams._id) {
                    //if id supplied its an edit operation
                    console.log('Edit');
                    getVisualboard($stateParams._id);
                }
                else //either index page or new board
                {
                    console.log('Add / List');
                    //if add board operation
                    vm.createHmi('Name HMI', 'Description', 0, {});
                    vm.hmi.organisationId = $rootScope.loggedInUser.organisationId;
                    vm.hmi.createdBy = $rootScope.loggedInUser._id;
                    //if boards list page
                    getAllVisualboards();
                }
            });

            console.log("Visualboard controller init");

        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Facilities.IndexController', Controller);

    function Controller($rootScope, $scope, $timeout, $window, UserService, ClientService, SiteService, FlashService, NgMap) {
        $rootScope.$on('rootScope:emit', function (event, data) {
            console.log(data); // 'Emit!'
            vm.tag = data.payloadString;
            $scope.$apply();
        });
          
        //   $scope.$on('rootScope:broadcast', function (event, data) {
        //     console.log(data); // 'Broadcast!'
        //   });
          
        //   $rootScope.$on('rootScope:broadcast', function (event, data) {
        //     console.log(data); // 'Broadcast!'
        //   });
       
        var vm = this;
        vm.itemsByPage = 5;
        vm.clients = null;
        vm.loggedInUser = null;
        vm.selectedNode = {};
        vm.selectedNode.level = 0;
        vm.newNode = {};
        vm.newNode.chkAddress = true;
        vm.newNode.latitude = 25.069059713471226;
        vm.newNode.longitude = 55.13911485671997;
        vm.createNode = createNode;
        vm.updateNode = updateNode;
        vm.deleteNode = deleteNode;
        //map options
        vm.mapOptions = {
            markerLocation: {
                latitude: 25.069059713471226,
                longitude: 55.13911485671997
            },
            markerOrigLocation: {
                latitude: 25.069059713471226,
                longitude: 55.13911485671997
            },
            circleLocation: {
                latitude: 25.069059713471226,
                longitude: 55.13911485671997
            }
        }
        var createMap, editMap;
        NgMap.getMap({ id: 'createMap' }).then(function (evtMap) {
            createMap = evtMap;
        });

        NgMap.getMap({ id: 'editMap' }).then(function (evtMap) {
            editMap = evtMap;
        });

        vm.initMapLocation = function () {
            if (vm.selectedNode.level == 2) {
                //console.log('edit', vm.selectedNode.level);
            }
            else {
                //console.log('create', vm.selectedNode.level);
                //init map options
                vm.mapOptions = {
                    markerLocation: {
                        latitude: 25.069059713471226,
                        longitude: 55.13911485671997
                    },
                    markerOrigLocation: {
                        latitude: 25.069059713471226,
                        longitude: 55.13911485671997
                    },
                    circleLocation: {
                        latitude: 25.069059713471226,
                        longitude: 55.13911485671997
                    }
                }
                //init map
                //var center = map.getCenter();
                google.maps.event.trigger(editMap, "resize");
                google.maps.event.trigger(createMap, "resize");
                //map.setCenter([vm.mapOptions.markerLocation.latitude, vm.mapOptions.markerLocation.longitude]);
            }
        }
        vm.discardUnsavedChanges = function () {
            //update map window
            vm.mapOptions.markerLocation.latitude = vm.mapOptions.markerOrigLocation.latitude;
            vm.mapOptions.markerLocation.longitude = vm.mapOptions.markerOrigLocation.longitude;
            vm.mapOptions.circleLocation.latitude = vm.mapOptions.markerOrigLocation.latitude;
            vm.mapOptions.circleLocation.longitude = vm.mapOptions.markerOrigLocation.longitude;
            //update text boxes
            if (vm.selectedNode.level == 2) {
                vm.selectedNode.latitude = vm.mapOptions.markerOrigLocation.latitude;
                vm.selectedNode.longitude = vm.mapOptions.markerOrigLocation.longitude;
            }
            else {
                //its a create operation
                vm.newNode.latitude = vm.mapOptions.markerOrigLocation.latitude;
                vm.newNode.longitude = vm.mapOptions.markerOrigLocation.longitude;
            }
        }

        vm.setMarkerPosition = function () {
            //update map window
            vm.mapOptions.markerLocation.latitude = vm.mapOptions.circleLocation.latitude;
            vm.mapOptions.markerLocation.longitude = vm.mapOptions.circleLocation.longitude;
            //update text boxes
            if (vm.selectedNode.level == 2) {
                vm.selectedNode.latitude = vm.mapOptions.circleLocation.latitude;
                vm.selectedNode.longitude = vm.mapOptions.circleLocation.longitude;
            }
            else {
                //its a create operation
                vm.newNode.latitude = vm.mapOptions.circleLocation.latitude;
                vm.newNode.longitude = vm.mapOptions.circleLocation.longitude;
            }
        }

        vm.setCirclePosition = function (event) {
            vm.mapOptions.circleLocation.latitude = event.latLng.lat();
            vm.mapOptions.circleLocation.longitude = event.latLng.lng();
        }

        vm.dragStart = function (event) {
            console.log("drag started");
        }
        vm.drag = function (event) {
            console.log("dragging");
        }
        vm.dragEnd = function (event) {
            vm.mapOptions.circleLocation.latitude = event.latLng.lat();
            vm.mapOptions.circleLocation.longitude = event.latLng.lng();
        }

        vm.setMarkerCenterMap = function () {
            //check if this is a edit operation
            if (vm.selectedNode.level == 2) {
                if (editMap.markers) {
                    //if(map.markers.count > 0)
                    {
                        editMap.setCenter(editMap.markers[0].position);
                    }
                }
            }
            else {
                //its a create operation
                if (createMap.markers) {
                    //if(map.markers.count > 0)
                    {
                        createMap.setCenter(createMap.markers[0].position);
                    }
                }
            }
        }

        vm.searchLocation = function () {
            //check if this is a edit operation
            if (vm.selectedNode.level == 2) {
                if (editMap.markers) {
                    //if(map.markers.count > 0)
                    {
                        editMap.setCenter(this.getPlace().geometry.location);
                        google.maps.event.trigger(createMap, "resize");
                    }
                }
            }
            else {
                //its a create operation
                if (createMap.markers) {
                    //if(map.markers.count > 0)
                    {
                        createMap.setCenter(this.getPlace().geometry.location);
                        google.maps.event.trigger(createMap, "resize");
                    }
                }
            }
        }

        vm.timeZones = [
            {
                "name": "Dateline Standard Time",
                "current_utc_offset": "-12:00"
            },
            {
                "name": "UTC-11",
                "current_utc_offset": "-11:00"
            },
            {
                "name": "Aleutian Standard Time",
                "current_utc_offset": "-09:00"
            },
            {
                "name": "Hawaiian Standard Time",
                "current_utc_offset": "-10:00"
            },
            {
                "name": "Marquesas Standard Time",
                "current_utc_offset": "-09:30"
            },
            {
                "name": "Alaskan Standard Time",
                "current_utc_offset": "-08:00"
            },
            {
                "name": "UTC-09",
                "current_utc_offset": "-09:00"
            },
            {
                "name": "Pacific Standard Time (Mexico)",
                "current_utc_offset": "-07:00"
            },
            {
                "name": "UTC-08",
                "current_utc_offset": "-08:00"
            },
            {
                "name": "Pacific Standard Time",
                "current_utc_offset": "-07:00"
            },
            {
                "name": "US Mountain Standard Time",
                "current_utc_offset": "-07:00"
            },
            {
                "name": "Mountain Standard Time (Mexico)",
                "current_utc_offset": "-06:00"
            },
            {
                "name": "Mountain Standard Time",
                "current_utc_offset": "-06:00"
            },
            {
                "name": "Central America Standard Time",
                "current_utc_offset": "-06:00"
            },
            {
                "name": "Central Standard Time",
                "current_utc_offset": "-05:00"
            },
            {
                "name": "Easter Island Standard Time",
                "current_utc_offset": "-06:00"
            },
            {
                "name": "Central Standard Time (Mexico)",
                "current_utc_offset": "-05:00"
            },
            {
                "name": "Canada Central Standard Time",
                "current_utc_offset": "-06:00"
            },
            {
                "name": "SA Pacific Standard Time",
                "current_utc_offset": "-05:00"
            },
            {
                "name": "Eastern Standard Time (Mexico)",
                "current_utc_offset": "-05:00"
            },
            {
                "name": "Eastern Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "Haiti Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "Cuba Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "US Eastern Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "Turks And Caicos Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "Paraguay Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "Atlantic Standard Time",
                "current_utc_offset": "-03:00"
            },
            {
                "name": "Venezuela Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "Central Brazilian Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "SA Western Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "Pacific SA Standard Time",
                "current_utc_offset": "-04:00"
            },
            {
                "name": "Newfoundland Standard Time",
                "current_utc_offset": "-02:30"
            },
            {
                "name": "Tocantins Standard Time",
                "current_utc_offset": "-03:00"
            },
            {
                "name": "E. South America Standard Time",
                "current_utc_offset": "-03:00"
            },
            {
                "name": "SA Eastern Standard Time",
                "current_utc_offset": "-03:00"
            },
            {
                "name": "Argentina Standard Time",
                "current_utc_offset": "-03:00"
            },
            {
                "name": "Greenland Standard Time",
                "current_utc_offset": "-02:00"
            },
            {
                "name": "Montevideo Standard Time",
                "current_utc_offset": "-03:00"
            },
            {
                "name": "Magallanes Standard Time",
                "current_utc_offset": "-03:00"
            },
            {
                "name": "Saint Pierre Standard Time",
                "current_utc_offset": "-02:00"
            },
            {
                "name": "Bahia Standard Time",
                "current_utc_offset": "-03:00"
            },
            {
                "name": "UTC-02",
                "current_utc_offset": "-02:00"
            },
            {
                "name": "Mid-Atlantic Standard Time",
                "current_utc_offset": "-01:00"
            },
            {
                "name": "Azores Standard Time",
                "current_utc_offset": "+00:00"
            },
            {
                "name": "Cape Verde Standard Time",
                "current_utc_offset": "-01:00"
            },
            {
                "name": "UTC",
                "current_utc_offset": "+00:00"
            },
            {
                "name": "Morocco Standard Time",
                "current_utc_offset": "+00:00"
            },
            {
                "name": "GMT Standard Time",
                "current_utc_offset": "+01:00"
            },
            {
                "name": "Greenwich Standard Time",
                "current_utc_offset": "+00:00"
            },
            {
                "name": "W. Europe Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "Central Europe Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "Romance Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "Sao Tome Standard Time",
                "current_utc_offset": "+01:00"
            },
            {
                "name": "Central European Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "W. Central Africa Standard Time",
                "current_utc_offset": "+01:00"
            },
            {
                "name": "Jordan Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "GTB Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Middle East Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Egypt Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "E. Europe Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Syria Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "West Bank Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "South Africa Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "FLE Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Israel Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Kaliningrad Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "Sudan Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "Libya Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "Namibia Standard Time",
                "current_utc_offset": "+02:00"
            },
            {
                "name": "Arabic Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Turkey Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Arab Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Belarus Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Russian Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "E. Africa Standard Time",
                "current_utc_offset": "+03:00"
            },
            {
                "name": "Iran Standard Time",
                "current_utc_offset": "+04:30"
            },
            {
                "name": "Arabian Standard Time",
                "current_utc_offset": "+04:00"
            },
            {
                "name": "Astrakhan Standard Time",
                "current_utc_offset": "+04:00"
            },
            {
                "name": "Azerbaijan Standard Time",
                "current_utc_offset": "+04:00"
            },
            {
                "name": "Russia Time Zone 3",
                "current_utc_offset": "+04:00"
            },
            {
                "name": "Mauritius Standard Time",
                "current_utc_offset": "+04:00"
            },
            {
                "name": "Saratov Standard Time",
                "current_utc_offset": "+04:00"
            },
            {
                "name": "Georgian Standard Time",
                "current_utc_offset": "+04:00"
            },
            {
                "name": "Caucasus Standard Time",
                "current_utc_offset": "+04:00"
            },
            {
                "name": "Afghanistan Standard Time",
                "current_utc_offset": "+04:30"
            },
            {
                "name": "West Asia Standard Time",
                "current_utc_offset": "+05:00"
            },
            {
                "name": "Ekaterinburg Standard Time",
                "current_utc_offset": "+05:00"
            },
            {
                "name": "Pakistan Standard Time",
                "current_utc_offset": "+05:00"
            },
            {
                "name": "India Standard Time",
                "current_utc_offset": "+05:30"
            },
            {
                "name": "Sri Lanka Standard Time",
                "current_utc_offset": "+05:30"
            },
            {
                "name": "Nepal Standard Time",
                "current_utc_offset": "+05:45"
            },
            {
                "name": "Central Asia Standard Time",
                "current_utc_offset": "+06:00"
            },
            {
                "name": "Bangladesh Standard Time",
                "current_utc_offset": "+06:00"
            },
            {
                "name": "Omsk Standard Time",
                "current_utc_offset": "+06:00"
            },
            {
                "name": "Myanmar Standard Time",
                "current_utc_offset": "+06:30"
            },
            {
                "name": "SE Asia Standard Time",
                "current_utc_offset": "+07:00"
            },
            {
                "name": "Altai Standard Time",
                "current_utc_offset": "+07:00"
            },
            {
                "name": "W. Mongolia Standard Time",
                "current_utc_offset": "+07:00"
            },
            {
                "name": "North Asia Standard Time",
                "current_utc_offset": "+07:00"
            },
            {
                "name": "N. Central Asia Standard Time",
                "current_utc_offset": "+07:00"
            },
            {
                "name": "Tomsk Standard Time",
                "current_utc_offset": "+07:00"
            },
            {
                "name": "China Standard Time",
                "current_utc_offset": "+08:00"
            },
            {
                "name": "North Asia East Standard Time",
                "current_utc_offset": "+08:00"
            },
            {
                "name": "Singapore Standard Time",
                "current_utc_offset": "+08:00"
            },
            {
                "name": "W. Australia Standard Time",
                "current_utc_offset": "+08:00"
            },
            {
                "name": "Taipei Standard Time",
                "current_utc_offset": "+08:00"
            },
            {
                "name": "Ulaanbaatar Standard Time",
                "current_utc_offset": "+08:00"
            },
            {
                "name": "North Korea Standard Time",
                "current_utc_offset": "+08:30"
            },
            {
                "name": "Aus Central W. Standard Time",
                "current_utc_offset": "+08:45"
            },
            {
                "name": "Transbaikal Standard Time",
                "current_utc_offset": "+09:00"
            },
            {
                "name": "Tokyo Standard Time",
                "current_utc_offset": "+09:00"
            },
            {
                "name": "Korea Standard Time",
                "current_utc_offset": "+09:00"
            },
            {
                "name": "Yakutsk Standard Time",
                "current_utc_offset": "+09:00"
            },
            {
                "name": "Cen. Australia Standard Time",
                "current_utc_offset": "+09:30"
            },
            {
                "name": "AUS Central Standard Time",
                "current_utc_offset": "+09:30"
            },
            {
                "name": "E. Australia Standard Time",
                "current_utc_offset": "+10:00"
            },
            {
                "name": "AUS Eastern Standard Time",
                "current_utc_offset": "+10:00"
            },
            {
                "name": "West Pacific Standard Time",
                "current_utc_offset": "+10:00"
            },
            {
                "name": "Tasmania Standard Time",
                "current_utc_offset": "+10:00"
            },
            {
                "name": "Vladivostok Standard Time",
                "current_utc_offset": "+10:00"
            },
            {
                "name": "Lord Howe Standard Time",
                "current_utc_offset": "+10:30"
            },
            {
                "name": "Bougainville Standard Time",
                "current_utc_offset": "+11:00"
            },
            {
                "name": "Russia Time Zone 10",
                "current_utc_offset": "+11:00"
            },
            {
                "name": "Magadan Standard Time",
                "current_utc_offset": "+11:00"
            },
            {
                "name": "Norfolk Standard Time",
                "current_utc_offset": "+11:00"
            },
            {
                "name": "Sakhalin Standard Time",
                "current_utc_offset": "+11:00"
            },
            {
                "name": "Central Pacific Standard Time",
                "current_utc_offset": "+11:00"
            },
            {
                "name": "Russia Time Zone 11",
                "current_utc_offset": "+12:00"
            },
            {
                "name": "New Zealand Standard Time",
                "current_utc_offset": "+12:00"
            },
            {
                "name": "UTC+12",
                "current_utc_offset": "+12:00"
            },
            {
                "name": "Fiji Standard Time",
                "current_utc_offset": "+12:00"
            },
            {
                "name": "Kamchatka Standard Time",
                "current_utc_offset": "+13:00"
            },
            {
                "name": "Chatham Islands Standard Time",
                "current_utc_offset": "+12:45"
            },
            {
                "name": "UTC+13",
                "current_utc_offset": "+13:00"
            },
            {
                "name": "Tonga Standard Time",
                "current_utc_offset": "+13:00"
            },
            {
                "name": "Samoa Standard Time",
                "current_utc_offset": "+13:00"
            },
            {
                "name": "Line Islands Standard Time",
                "current_utc_offset": "+14:00"
            }
        ];

        vm.timeZones.sort(dynamicSort('current_utc_offset'));

        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }


        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;
                vm.clients = [];

                GetAllClients();
            });

            vm.my_data = [];
            vm.my_tree = tree = {};

            var tree;

            //check every node that is selected
            vm.my_tree_handler = function (branch) {
                vm.selectedNode = branch;
                //console.log(vm.selectedNode);
                //if site selected, then check and update location
                if (vm.selectedNode.level == 2) {
                    if (vm.selectedNode.latitude) {
                        vm.mapOptions.markerLocation.latitude = vm.selectedNode.latitude;
                        vm.mapOptions.circleLocation.latitude = vm.selectedNode.latitude;
                        vm.mapOptions.markerOrigLocation.latitude = vm.selectedNode.latitude;
                    }

                    if (vm.selectedNode.longitude) {
                        vm.mapOptions.markerLocation.longitude = vm.selectedNode.longitude;
                        vm.mapOptions.circleLocation.longitude = vm.selectedNode.longitude;
                        vm.mapOptions.markerOrigLocation.longitude = vm.selectedNode.longitude;
                    }
                }
                vm.selectedNode.fullName = '';
                vm.get_hierarchical_name_selected_tree_branch(vm.selectedNode);
            };

            //load tree data synch
            vm.load_tree_data = function (tree_data) {
                vm.my_data = tree_data;
                vm.my_tree.expand_all();
            };

            //load tree data asynch
            vm.async_load_tree_data = function (tree_data) {
                vm.my_data = [];
                vm.doing_async = true;
                return $timeout(function () {
                    vm.my_data = tree_data;
                    vm.doing_async = false;
                    return vm.my_tree.expand_all();
                }, 1000);
            };

            //add child node to selected node
            vm.add_tree_branch = function (newNode) {
                var selectedNode = vm.my_tree.get_selected_branch();
                return tree.add_branch(selectedNode, newNode);
            };

            vm.update_selected_tree_branch = function (updateNode) {
                var selectedNode = vm.my_tree.get_selected_branch();
                var parrentNode = vm.my_tree.get_parent_branch(selectedNode);
                return tree.update_branch(parrentNode, selectedNode, updateNode);
            };

            vm.remove_selected_tree_branch = function () {
                var selectedNode = vm.my_tree.get_selected_branch();
                var parrentNode = vm.my_tree.get_parent_branch(selectedNode);
                return tree.remove_branch(parrentNode, selectedNode);
            };

            vm.get_hierarchical_name_selected_tree_branch = function (selectedNode) {
                vm.selectedNode.fullName = selectedNode.abbrv + '/';
                var parrentNode = vm.my_tree.get_parent_branch(selectedNode);
                while (parrentNode != undefined) {
                    vm.selectedNode.fullName = parrentNode.abbrv + '/' + vm.selectedNode.fullName;
                    parrentNode = vm.my_tree.get_parent_branch(parrentNode);
                }
            };
        }


        function createNode() {
            switch (vm.selectedNode.level) {
                case 1: //Add Site
                    createSite();
                    break;

                case 2: //Add Facility
                    createFacility();
                    break;

                case 3: //Add Asset
                    createAsset();
                    break;

                case 4: //Add Tag
                    createTag();
                    break;

                default:
                    console.log('createNode : case not found');
                    break;
            }
        }

        function createSite() {
            var newSite = {};
            newSite.name = vm.newNode.name;
            newSite.label = vm.newNode.name;
            newSite.lastModifiedBy = vm.loggedInUser.email;
            newSite.createdBy = vm.loggedInUser.email;
            newSite.abbrv = vm.newNode.abbrv;
            newSite.status = "true";
            newSite.description = vm.newNode.description;
            newSite.organisationId = vm.selectedNode._id;
            newSite.latitude = vm.newNode.latitude;
            newSite.longitude = vm.newNode.longitude;
            newSite.timeZone = vm.newNode.timeZone;
            newSite.children = [];
            newSite.level = 2;
            //update client to add site
            SiteService.Create(newSite)
                .then(function () {
                    FlashService.Success('Operation were successfully completed.', 'Record Create : Site');

                    //assign facilities as children for treeview
                    newSite.children = newSite.children;

                    //update tree view
                    vm.add_tree_branch(newSite);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

            //clear old values
            vm.newNode = {};
        }

        function createFacility() {
            var newFacility = {};
            newFacility.name = vm.newNode.name;
            newFacility.label = vm.newNode.name;
            newFacility.lastModifiedBy = vm.loggedInUser.email;
            newFacility.createdBy = vm.loggedInUser.email;
            newFacility.abbrv = vm.newNode.abbrv;
            newFacility.status = "true";
            newFacility.description = vm.newNode.description;
            newFacility.siteId = vm.selectedNode._id;
            newFacility.children = [];
            newFacility.level = 3;

            //add to tree
            vm.add_tree_branch(newFacility);

            //update site + create facility
            updateSite(vm.selectedNode);

            //clear old values
            vm.newNode = {};
        }

        function createAsset() {
            var newAsset = {};
            newAsset.name = vm.newNode.name;
            newAsset.label = vm.newNode.name;
            newAsset.lastModifiedBy = vm.loggedInUser.email;
            newAsset.createdBy = vm.loggedInUser.email;
            newAsset.abbrv = vm.newNode.abbrv;
            newAsset.status = "true";
            newAsset.description = vm.newNode.description;
            newAsset.facilityId = vm.selectedNode._id;
            newAsset.children = [];
            newAsset.tags = [];
            newAsset.level = 4;

            //add to tree
            vm.add_tree_branch(newAsset);

            //update site + update facility + create asset
            var siteNode = vm.my_tree.get_parent_branch(vm.selectedNode);
            updateSite(siteNode);

            //clear old values
            vm.newNode = {};
        }

        function createTag() {

            //update site + update facility + update asset + create tag
            var facilityNode = vm.my_tree.get_parent_branch(vm.selectedNode);
            var siteNode = vm.my_tree.get_parent_branch(facilityNode);
            var clientNode = vm.my_tree.get_parent_branch(siteNode);

            var newTag = {};
            newTag.name = vm.selectedNode.fullName + vm.newNode.name.toUpperCase();
            newTag.label = newTag.name;
            newTag.lastModifiedBy = vm.loggedInUser._id;
            newTag.createdBy = vm.loggedInUser._id;
            if (vm.newNode.chkAddress)
                newTag.address = newTag.name;
            else
                newTag.address = vm.newNode.address;

            newTag.description = vm.newNode.description;
            newTag.children = [];
            newTag.level = 5;
            newTag.clientId = clientNode.mqttClientId;

            //add to tree
            //vm.add_tree_branch(newTag);
            if (!vm.selectedNode.tags)
                vm.selectedNode.tags = [];
            vm.selectedNode.tags.push(newTag);
            console.log('client node', clientNode);
            console.log('site node', siteNode);
            console.log('facility node', facilityNode);
            console.log('device node', vm.selectedNode);
            console.log('new tag', newTag);
            updateSite(siteNode);

            //clear old values
            vm.newNode = {};
        }

        function updateNode() {
            switch (vm.selectedNode.level) {
                case 1: //Update client
                    updateClient(vm.selectedNode);
                    break;

                case 2: //Update site
                    //update marker locations, just in case
                    updateSite(vm.selectedNode);
                    break;

                case 3: //Update facility
                    updateFacility(vm.selectedNode);
                    break;

                case 4: //Update asset
                    updateAsset(vm.selectedNode);
                    break;
                case 5: //Update tag
                    updateTag(vm.selectedNode);
                    break;
                default:
                    console.log('updateNode : case not found');
                    break;
            }
        }

        function updateClient(clientNode) {
            var client = {};
            client._id = clientNode._id;
            client.name = clientNode.label;
            client.label = clientNode.label;
            client.logo = clientNode.logo;
            client.lastModifiedBy = vm.loggedInUser.email;
            client.abbrv = clientNode.abbrv;
            client.status = clientNode.status;
            client.description = clientNode.description;

            //update client
            ClientService.Update(client)
                .then(function () {
                    FlashService.Success('Operation were successfully completed.');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function updateSite(siteNode) {
            var site = {};
            site._id = siteNode._id;
            site.name = siteNode.label;
            site.label = siteNode.label;
            site.organisationId = siteNode.organisationId;
            site.lastModifiedBy = vm.loggedInUser.email;
            site.abbrv = siteNode.abbrv;
            site.status = siteNode.status;
            site.description = siteNode.description;
            site.latitude = siteNode.latitude;
            site.longitude = siteNode.longitude;
            site.timeZone = siteNode.timeZone;
            site.children = siteNode.children;
            for (let index = 0; index < site.children.length; index++) {
                site.children[index].name = site.children[index].label;
            }
            //update site
            SiteService.Update(site)
                .then(function () {
                    FlashService.Success('Operation were successfully completed.');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function updateFacility(facilityNode) {
            var facility = {};
            facility.name = facilityNode.label;
            facility.label = facilityNode.label;
            facility.lastModifiedBy = vm.loggedInUser.email;
            facility.abbrv = facilityNode.abbrv;
            facility.status = facilityNode.status;
            facility.description = facilityNode.description;
            facility.children = facilityNode.children;
            facility.level = 3;
            //vm.update_selected_tree_branch();
            //update site
            var siteNode = vm.my_tree.get_parent_branch(vm.selectedNode);
            updateSite(siteNode);
        }

        function updateAsset(assetNode) {
            var asset = {};
            asset.name = assetNode.label;
            asset.label = assetNode.label;
            asset.lastModifiedBy = vm.loggedInUser.email;
            asset.abbrv = assetNode.abbrv;
            asset.status = assetNode.status;
            asset.description = assetNode.description;
            asset.children = assetNode.children;
            asset.level = 4;
            //update site
            var facilityNode = vm.my_tree.get_parent_branch(vm.selectedNode);
            var siteNode = vm.my_tree.get_parent_branch(facilityNode);
            updateSite(siteNode);
        }

        function updateTag(tagNode) {
            //update site
            var assetNode = vm.my_tree.get_parent_branch(vm.selectedNode);
            var facilityNode = vm.my_tree.get_parent_branch(assetNode);
            var siteNode = vm.my_tree.get_parent_branch(facilityNode);
            var clientNode = vm.my_tree.get_parent_branch(siteNode);

            var tag = {};
            tag.name = tagNode.label;
            tag.label = tagNode.label;
            tag.lastModifiedBy = vm.loggedInUser._id;
            if (vm.newNode.chkAddress)
                tag.address = tagNode.label;
            else
                tag.address = tagNode.address;
            asset.status = tagNode.status;
            tag.description = tagNode.description;
            tag.test = 'test';
            tag.clientId = clientNode.mqttClientId;
            tag.children = tagNode.children;
            tag.level = 5;

            updateSite(siteNode);
        }

        function deleteNode() {
            switch (vm.selectedNode.level) {
                case 1: //Delete client
                    break;

                case 2: //Delete site
                    deleteSite(vm.selectedNode);
                    break;

                case 3: //Delete facility
                    deleteFacility(vm.selectedNode);
                    break;

                case 4: //Delete asset
                    deleteAsset(vm.selectedNode);
                    break;

                case 5: //Delete tag
                    deleteTag(vm.selectedNode);
                    break;

                default:
                    console.log('deleteNode : case not found');
                    break;
            }
        }

        function deleteSite(siteNode) {
            //update site
            SiteService.Delete(siteNode._id)
                .then(function () {
                    vm.remove_selected_tree_branch();
                    FlashService.Success('Operation were successfully completed.');

                    //clear selected node
                    vm.selectedNode = {};
                    vm.selectedNode.level = 0;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteFacility(facilityNode) {
            //update site + delete facility
            vm.remove_selected_tree_branch();
            var selectedNode = vm.my_tree.get_selected_branch();
            var siteNode = vm.my_tree.get_parent_branch(selectedNode);
            updateSite(siteNode);

            //clear selected node
            vm.selectedNode = {};
            vm.selectedNode.level = 0;
        }

        function deleteAsset(assetNode) {
            //update site + update facility + delete asset

            //remove from tree
            vm.remove_selected_tree_branch();

            //remove from database
            var selectedNode = vm.my_tree.get_selected_branch();
            var facilityNode = vm.my_tree.get_parent_branch(selectedNode);
            var siteNode = vm.my_tree.get_parent_branch(facilityNode);
            updateSite(siteNode);

            //clear selected node
            vm.selectedNode = {};
            vm.selectedNode.level = 0;
        }

        function deleteTag(assetNode) {
            //update site + update facility + delete asset

            //remove from tree     
            vm.remove_selected_tree_branch();

            //remove from database
            var selectedNode = vm.my_tree.get_selected_branch();
            var assetNode = vm.my_tree.get_parent_branch(selectedNode);
            var facilityNode = vm.my_tree.get_parent_branch(assetNode);
            var siteNode = vm.my_tree.get_parent_branch(facilityNode);
            updateSite(siteNode);

            //clear selected node
            vm.selectedNode = {};
            vm.selectedNode.level = 0;
        }

        function GetAllClients() {
            if (vm.loggedInUser.role != 'Platform Admin.') {
                ClientService.GetById(vm.loggedInUser.organisationId)
                    .then(function (clients, res) {
                        //update clients
                        vm.clients = [];
                        var treeData = [];
                        var clientNode = {};
                        var siteNode = {};


                        //transform results for tree
                        clients.forEach(client => {
                            //process client
                            clientNode = {};
                            clientNode.name = client.name;
                            clientNode.label = client.name;
                            clientNode._id = client._id;
                            clientNode.abbrv = client.abbrv;
                            clientNode.status = client.status;
                            clientNode.mqttClientId = client.mqttClientId;
                            clientNode.description = client.description;
                            clientNode.level = 1;
                            clientNode.logo = client.logo;

                            //process sites
                            clientNode.children = [];

                            //if any sites exist
                            if (client.sites) {
                                for (let index = 0; index < client.sites.length; index++) {
                                    siteNode = {};
                                    siteNode.name = client.sites[index].name;
                                    siteNode.label = client.sites[index].name;
                                    siteNode._id = client.sites[index]._id;
                                    siteNode.status = client.sites[index].status;
                                    siteNode.description = client.sites[index].description;
                                    siteNode.longitude = client.sites[index].longitude;
                                    siteNode.latitude = client.sites[index].latitude;
                                    siteNode.timeZone = client.sites[index].timeZone;
                                    siteNode.organisationId = client.sites[index].organisationId;
                                    siteNode.abbrv = client.sites[index].abbrv;
                                    siteNode.level = 2;
                                    siteNode.children = client.sites[index].children;
                                    clientNode.children.push(siteNode);
                                }
                            }
                            //add organisation / client node
                            treeData.push(clientNode);
                        });

                        //load tree asynch
                        vm.async_load_tree_data(treeData);
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
            else {
                ClientService.GetAll()
                    .then(function (clients, res) {
                        //update clients
                        vm.clients = clients;
                        var treeData = [];
                        var clientNode = {};
                        var siteNode = {};


                        //transform results for tree
                        clients.forEach(client => {
                            //process client
                            clientNode = {};
                            clientNode.name = client.name;
                            clientNode.label = client.name;
                            clientNode._id = client._id;
                            clientNode.abbrv = client.abbrv;
                            clientNode.status = client.status;
                            clientNode.mqttClientId = client.mqttClientId;
                            clientNode.description = client.description;
                            clientNode.level = 1;
                            clientNode.logo = client.logo;

                            //process sites
                            clientNode.children = [];

                            //if any sites exist
                            if (client.sites) {
                                for (let index = 0; index < client.sites.length; index++) {
                                    siteNode = {};
                                    siteNode.name = client.sites[index].name;
                                    siteNode.label = client.sites[index].name;
                                    siteNode._id = client.sites[index]._id;
                                    siteNode.status = client.sites[index].status;
                                    siteNode.description = client.sites[index].description;
                                    siteNode.longitude = client.sites[index].longitude;
                                    siteNode.latitude = client.sites[index].latitude;
                                    siteNode.timeZone = client.sites[index].timeZone;
                                    siteNode.organisationId = client.sites[index].organisationId;
                                    siteNode.abbrv = client.sites[index].abbrv;
                                    siteNode.level = 2;
                                    siteNode.children = client.sites[index].children;
                                    clientNode.children.push(siteNode);
                                }
                            }
                            //add organisation / client node
                            treeData.push(clientNode);
                        });

                        //load tree asynch
                        vm.async_load_tree_data(treeData);
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
        }

        //file upload functions
        vm.updateLogo = function (event) {

            var files = event.target.files;
            var file = files[files.length - 1];
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.$apply(function () {
                    vm.selectedNode.logo = event.target.result;
                });
            }

            if (file) {
                reader.readAsDataURL(file);
            }

            // get <input> element and the selected file 
            // var imgFileInput = document.getElementById('logoUpload');
            // var imgFile = imgFileInput.files[0];

            // if (imgFile) {
            //     reader.readAsDataURL(imgFile);
            // }

        };
    }

    
})();
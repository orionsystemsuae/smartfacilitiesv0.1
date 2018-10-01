(function () {
    'use strict';

    angular
        .module('app')
        .controller('Sites.IndexController', Controller);

    function Controller($rootScope, $window, $stateParams, UserService, FlashService, ClientService, SiteService) {
        //properties
        var vm = this;
        vm.itemsByPage = 5;
        vm.site = {};
        vm.sites = null;
        vm.client = {};
        vm.clients = null;
        vm.loggedInUser = null;
        vm.selectedRow = null;  // initialize our variable to null
        //methods
        vm.setClickedRow = setClickedRow;
        vm.updateLocation = updateLocation;
        vm.createSite = createSite;
        vm.updateSite = updateSite;
        vm.deleteSite = deleteSite;
        vm.activateSite = activateSite;

        //map options
        vm.locationpickerOptions = {
            location: {
                latitude: 46.15242437752303,
                longitude: 2.7470703125
            },
            inputBinding: {
                //latitudeInput: $('#us3-lat'),
                //longitudeInput: $('#us3-long'),
                // radiusInput: $('#us3-radius'),
                locationNameInput: $('#us3-address')
            },
            radius: 0,
            enableAutocomplete: true,
            onchanged: function (currentLocation, radius, isMarkerDropped) {
                vm.site.latitude = currentLocation.latitude;
                vm.site.longitude = currentLocation.longitude;
                vm.updateLocation();
            }
        };

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;

                //load all clients
            GetAllClients();

            //if id param supplied its edit else view all users
            if($stateParams._id)
                GetSite($stateParams._id)
            else
                GetAllSites();
            });

            
        }

        function createSite() {
            
            vm.site.createdBy = vm.loggedInUser.email;
            vm.site.lastModifiedBy = vm.loggedInUser.email;
            // if(vm.loggedInUser.role != 'Platform Admin.')
            // {
            //     vm.site.organisationId = vm.loggedInUser.organisationId;
            // }
            //update client to add site
            SiteService.Create(vm.site)
                .then(function () {
                    FlashService.Success('Site saved.');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function updateSite() {         
            //update client to add site
            SiteService.Update(vm.site)
                .then(function () {
                    FlashService.Success('Site updated.');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        
        function deleteSite(site) {
            var index = -1;	
            var siteId = site._id;
            var sitesArr = eval( vm.sites );
            for( var i = 0; i < sitesArr.length; i++ ) {
                if( sitesArr[i]._id === siteId ) {
                    index = i;
                    break;
                }
            }
            if( index === -1 ) {
                alert( "Something gone wrong" );
            }
            else
            {
                //remove site from db
                SiteService.Delete(siteId)
                .then(function () {
                //remove site from grid
                vm.sites.splice( index, 1 );	
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        
        }

        function activateSite(site, newStatus) {
            var index = -1;	
            var siteId = site._id;
            //update site in $scope
            var sitesArr = [];
                
            //update site in $scope - sites
            var sitesArr = eval( vm.sites );
            for( var i = 0; i < sitesArr.length; i++ ) {
                if( sitesArr[i]._id === siteId ) {
                    sitesArr[i].status = newStatus;
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
                site.status = newStatus;

                SiteService.Update(site)
                .then(function () {
                //update user in grid
                vm.sites[index].status = newStatus;	
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        }

        function GetAllSites() {
            if(vm.loggedInUser.role != 'Platform Admin.')
            { 
                SiteService.GetAllByClientId(vm.loggedInUser.organisationId)
                .then(function (sites, res) {
                vm.sites = sites;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
            else
            {
                SiteService.GetAll()
                .then(function (sites, res) {
                vm.sites = sites;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        }

        function GetSite(siteId) {
            SiteService.GetById(siteId)
                .then(function (site, res) {	
                vm.site = site;
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

        function GetClient(clientId) {

            ClientService.GetById(clientId)
                .then(function (client, res) {
                    vm.client = client;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
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

    function updateLocation()
    {
         $('latitude').trigger('input'); // Use for Chrome/Firefox/Edge
         $('latitude').trigger('change'); // Use for Chrome/Firefox/Edge + IE11
         $('longitude').trigger('input'); // Use for Chrome/Firefox/Edge
         $('longitude').trigger('change'); // Use for Chrome/Firefox/Edge + IE11
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Dashboards.IndexController', Controller);

    function Controller($scope, $rootScope, $state, $stateParams, UserService, DashboardService, FlashService) {
        var vm = this;
        vm.iconText = "";
        $scope.state = $state;
        // $scope.LineChart = {
        //     data: [1, 2, 3, 4, 3, 1],
        //     options: {
        //         width: 150,
        //         stroke: "#eee"
        //     }
        // };
        // $scope.BarChart = {
        //     data: [1, 2, 3, 4],
        //     options: {
        //         width: 150,
        //         height: 150
        //     }
        // };

        vm.dashboardsPrivate = null;
        vm.dashboardsShared = null;
        vm.itemsPrivatePerPage = 5;
        vm.itemsSharedPerPage = 5;
        vm.loadingPrivateDashboards = true;
        vm.loadingSharedDashboards = true;
        vm.dashboard = null;

        vm.addWidget = addWidget;
        vm.addState = addState;
        vm.addTopic = addTopic;

        vm.saveDashboard = saveDashboard;
        //vm.updateDashboard = updateDashboard;
        vm.deleteDashboard = deleteDashboard;
        vm.pinDashboard = pinDashboard;
        vm.clearAllWidgets = clearAllWidgets;
        vm.pageState = "add";
        vm.animations = [
            {
                "name": "",
                "value": ""
            },
            {
                "name": "Wrench",
                "value": "faa-wrench animated"
            },
            {
                "name": "Ring",
                "value": "faa-ring animated"
            },
            {
                "name": "Horizontal",
                "value": "faa-horizontal animated"
            },
            {
                "name": "Vertical",
                "value": "faa-vertical animated"
            },
            {
                "name": "Flash",
                "value": "faa-flash animated"
            },
            {
                "name": "Bounce",
                "value": "faa-bounce animated"
            },
            {
                "name": "Spin",
                "value": "faa-spin animated"
            },
            {
                "name": "Float",
                "value": "faa-float animated"
            },
            {
                "name": "Pulse",
                "value": "faa-pulse animated"
            },
            {
                "name": "Shake",
                "value": "faa-shake animated"
            },
            {
                "name": "Tada",
                "value": "faa-tada animated"
            },
            {
                "name": "Passing",
                "value": "faa-passing animated"
            },
            {
                "name": "Passing Rev",
                "value": "faa-passing-reverse animated"
            },
            {
                "name": "Burst",
                "value": "faa-burst animated"
            },
            {
                "name": "Falling",
                "value": "faa-falling animated"
            }];
        initController();
        console.log("Dashboards controller init");



        //function definations

        //ititilize controller and local variables
        function initController() {
            // vm.loadingPrivateDashboards = true;
            // vm.loadingSharedDashboards = true;
            // get current user
            UserService.GetCurrent().then(function (user) {
                //logged in user
                vm.loggedInUser = user;
                $rootScope.loggedInUser = user;


                //if current state is view
                if ($rootScope.currentState == "dashboards_view") {
                    //if no id supplied its possible a list operation
                    GetAllDashboards();
                }
                //if current state is edit
                else if ($rootScope.currentState == "dashboards_edit") {
                    if ($stateParams._id) {
                        //if id supplied its an edit operation
                        GetDashboard($stateParams._id);
                    }
                }
                //if current state is add
                else if ($rootScope.currentState == "dashboards_add") {
                    vm.dashboard = {};
                    vm.dashboard.name = "New Dashboard";
                    vm.dashboard.description = "New Dashboard Description";
                    vm.dashboard.organisationId = vm.loggedInUser.organisationId;
                    vm.dashboard.createdBy = vm.loggedInUser._id;
                    vm.dashboard.type = "private";
                    vm.dashboard.widgets = [];
                    vm.dashboard.homepage = false;
                    vm.dashboard.options = {
                        columns: 6, // the width of the grid, in columns
                        rows: 3, // the width of the grid, in columns
                        pushing: true, // whether to push other items out of the way on move or resize
                        floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                        swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                        //rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                        margins: [2, 2], // the pixel distance between each widget
                        outerMargin: true, // whether margins apply to outer edges of the grid
                        sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                        isMobile: false, // stacks the grid items if true
                        mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                        mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                        minColumns: 1, // the minimum columns the grid must have
                        minRows: 2, // the minimum height of the grid, in rows
                        maxRows: 100,
                        defaultSizeX: 2, // the default width of a gridster item, if not specifed
                        defaultSizeY: 1, // the default height of a gridster item, if not specified
                        minSizeX: 1, // minimum column width of an item
                        maxSizeX: null, // maximum column width of an item
                        minSizeY: 1, // minumum row height of an item
                        maxSizeY: null, // maximum row height of an item
                        resizable: {
                            enabled: true,
                            handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                            start: function (event, $element, widget) { }, // optional callback fired when resize is started,
                            resize: function (event, $element, widget) { }, // optional callback fired when item is resized,
                            stop: function (event, $element, widget) { } // optional callback fired when item is finished resizing
                        },
                        draggable: {
                            enabled: true, // whether dragging items is supported
                            // handle: '.my-class', // optional selector for drag handle
                            start: function (event, $element, widget) { }, // optional callback fired when drag is started,
                            drag: function (event, $element, widget) { }, // optional callback fired when item is moved,
                            stop: function (event, $element, widget) { } // optional callback fired when item is finished dragging
                        }

                    };
                }
                // $scope.$watch('vm.variablename', function (newVal, oldVal) {

                // });
            });
        }

        //Get All Dashboards
        function GetAllDashboards() {
            // if (vm.loggedInUser.role != 'Platform Admin.') {

            //retrive private dashboards
            DashboardService.GetPrivateByUserId(vm.loggedInUser._id)
                .then(function (dashboardsPrivate, res) {
                    vm.dashboardsPrivate = dashboardsPrivate;
                    vm.loadingPrivateDashboards = false;
                })
                .catch(function (error) {
                    FlashService.Error(error, 'Dashboard : Fetch - Private');
                    vm.loadingPrivateDashboards = false;
                });

            //retrive shared dashboards
            DashboardService.GetSharedByUserId(vm.loggedInUser._id)
                .then(function (dashboardsShared, res) {
                    vm.dashboardsShared = dashboardsShared;
                    vm.loadingSharedDashboards = false;
                })
                .catch(function (error) {
                    FlashService.Error(error, 'Dashboard : Shared');
                    vm.loadingSharedDashboards = false;
                });
            // }
            // else {
            //     DashboardService.GetAll()
            //         .then(function (dashboards, res) {
            //             vm.dashboards = dashboards;
            //         })
            //         .catch(function (error) {
            //             FlashService.Error(error);
            //         });
            // }
        }

        function GetDashboard(dashboardId) {
            DashboardService.GetById(dashboardId)
                .then(function (dashboard, res) {
                    vm.dashboard = dashboard;
                })
                .catch(function (error) {
                    FlashService.Error(error, 'Dashboard : Fetch');
                });
        }

        //delete all widgets in current dashboard
        function clearAllWidgets() {
            vm.dashboard.widgets = [];
        };

        //save sashboard
        function saveDashboard() {
            if (vm.dashboard._id) {
                //update dashboard
                DashboardService.Update(vm.dashboard)
                    .then(function () {
                        FlashService.Success('Operation was succefully completed.', 'Dashboard : Update');
                    })
                    .catch(function (error) {
                        FlashService.Error(error, 'Dashboard : Update');
                    });
            }
            else {
                //create dashboard
                DashboardService.Create(vm.dashboard)
                    .then(function () {
                        FlashService.Success('Operation was succefully completed.', 'Dashboard : Create');
                    })
                    .catch(function (error) {
                        FlashService.Error(error, 'Dashboard : Create');
                    });
            }
        };

        function deleteDashboard(dashboard) {
            var index = -1;
            var dashboardId = dashboard._id;
            var dashboardsPrivateArr = eval(vm.dashboardsPrivate);
            for (var i = 0; i < dashboardsPrivateArr.length; i++) {
                if (dashboardsPrivateArr[i]._id === dashboardId) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                FlashService.Error("Operation failed. Something went wrong.", 'Dashboard : Delete');
            }
            else {
                //remove user from db
                DashboardService.Delete(dashboardId)
                    .then(function () {
                        //remove dashboard from grid
                        vm.dashboardsPrivate.splice(index, 1);
                    })
                    .catch(function (error) {
                        FlashService.Error(error, 'Dashboard : Delete');
                    });
            }
        }

        function pinDashboard(dashboard, newStatus) {
            var index = -1;
            var dashboardId = dashboard._id;
            var dashboardsPrivateArr = eval(vm.dashboardsPrivate);
            for (var i = 0; i < dashboardsPrivateArr.length; i++) {
                if (dashboardsPrivateArr[i]._id === dashboardId) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                FlashService.Error("Operation failed. Something went wrong.", 'Dashboard : Pin to Home');
            }
            else {
                //update dashboard in db
                dashboard.homepage = newStatus;
                DashboardService.Update(dashboard)
                    .then(function () {
                        //update dashboard in grid
                        vm.dashboardsPrivate[index].homepage = newStatus;
                    })
                    .catch(function (error) {
                        FlashService.Error(error, 'Dashboard : Pin to Home');
                    });
            }
        }


        //add a new single value widget to dashboard
        function addWidget(type) {
            switch (type) {
                case 1:
                    addInformationTile(type);
                    break;

                default:
                    break;
            }
        }

        
        //add a new single value widget to dashboard
        function addInformationTile(type) {
            vm.dashboard.widgets.push({
                typeId: type,
                type: "Information Tile",
                name: "New Widget",
                descriptiom: "",
                header: {
                    text: "Header Text",
                    textAlignment: "2", //1=left, 2=center, 3=right, 4=justify
                    show: true,
                    borderShow: true,
                    backgroundColor: "#ffffff",
                    fontColor: "#005cb8",
                    fontSize: 20,
                    fontBold: true,
                    fontItalic: false,
                    fontUnderline: false
                },
                footer: {
                    text: "Footer Text",
                    textAlignment: "2", //1=left, 2=center, 3=right, 4= justify
                    backgroundColor: "#ffffff",
                    show: true,
                    borderShow: true,
                    fontSize: 15,
                    fontColor: "#005cb8",
                    fontBold: false,
                    fontItalic: false,
                    fontUnderline: false
                },
                body: {
                    backgroundColor: "#ffffff",
                    borderShow: true,
                    content: {
                        value: {
                            fontSize: 36,
                            fontBold: false,
                            fontItalic: false,
                            fontUnderline: false,
                            show: true,
                        },
                        icon: {
                            fontSize: 27,
                            fontBold: false,
                            fontItalic: false,
                            fontUnderline: false,
                            show: true
                        },
                        text: {
                            fontSize: 18,
                            fontBold: false,
                            fontItalic: false,
                            fontUnderline: false,
                            show: true,
                        },
                        topic: [{
                            address: "Topic/Address",
                            graph: {
                                show: "1",
                                type: "line",  //line, bar, pie
                            },
                            stateTable: [
                                {
                                    "value": "default",
                                    "valueColor": "#005cb8",
                                    "text": "*",
                                    "textColor": "#005cb8",
                                    "icon": "fas fa-asterisk",
                                    "iconColor": "#005cb8",
                                    "animation": ""
                                }
                            ]
                        }]
                    },
                },
                sizeX: 1,
                sizeY: 1
            });
        };

        function addTopic() {
            vm.dashboard.widgets[vm.selectedWidgetIndex].body.content.topic.push({
                address: "Topic/Address",
                graph: {
                    show: "1",
                    type: "line",  //line, bar, pie
                },
                stateTable: [
                    {
                        "value": "default",
                        "valueColor": "#005cb8",
                        "text": "*",
                        "textColor": "#005cb8",
                        "icon": "fas fa-asterisk",
                        "iconColor": "#005cb8",
                        "animation": ""
                    }
                ]
            });
        }

        function addState(topicIndex) {
            vm.dashboard.widgets[vm.selectedWidgetIndex].body.content.topic[topicIndex].stateTable.push({
                "value": "default",
                "valueColor": "#005cb8",
                "text": "*",
                "textColor": "#005cb8",
                "icon": "fas fa-asterisk",
                "iconColor": "#005cb8",
                "animation": ""
            });
            console.log(vm.dashboard.widgets[vm.selectedWidgetIndex].body.content.topic[topicIndex]);
        }


        //add initial topic
    }
})();
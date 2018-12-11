(function () {
    'use strict';

    angular
        .module('app', ['ngSanitize', 'ngMaterial', 'ui.router', 'smart-table', 'ngMessages', 'gridster', 'angularBootstrapNavTree', 'colorpicker.module', 'ngMap', 'ngAnimate', 'mqttModule', 'pageslide-directive', 'slick', 'angular-momentjs', 'nvd3ChartDirectives', 'chart.js', 'daterangepicker', 'ngFitText', 'elif', 'gridshore.c3js.chart'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider, $momentProvider, ChartJsProvider, fitTextConfigProvider) {
        
        ChartJsProvider.setOptions({ responsive: true, maintainAspectRatio: false, colors: ['#08306b', '#08519c', '#2171b5', '#4292c6', '#9ecae1', '#c6dbef', '#deebf7'] });
        //configure momment
        $momentProvider
            .asyncLoading(false)
            .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');

        //
        fitTextConfigProvider.config = {
            //debounce: _.debounce,               // include a vender function like underscore or lodash
            debounce: function(a,b,c) {         // OR specify your own function
              var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}
            },
            delay: 500,                        // debounce delay
            loadDelay: 5,                      // global default delay before initial calculation
            compressor: 1,                      // global default calculation multiplier
            min: 0,                             // global default min
            max: Number.POSITIVE_INFINITY,       // global default max
          };

        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home', breadcrumb: 'Home' }
            })
            .state('dashboards', {
                url: '/dashboards',
                templateUrl: 'dashboards/index.html',
                controller: 'Dashboards.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'dashboards', breadcrumb: 'Dashboards' }
            })
            .state('dashboards_view', {
                url: '/dashboards/view',
                templateUrl: 'dashboards/dashboards.view.html',
                controller: 'Dashboards.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'dashboards', breadcrumb: 'Dashboards > View', name: 'dashboards_view' }
            })
            .state('dashboards_add', {
                url: '/dashboards/add/:_id',
                templateUrl: 'dashboards/dashboards.add.html',
                controller: 'Dashboards.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'dashboards', breadcrumb: 'Dashboards > Add', name: 'dashboards_add' }
            })
            .state('dashboards_edit', {
                url: '/dashboards/edit/:_id',
                templateUrl: 'dashboards/dashboards.add.html',
                controller: 'Dashboards.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'dashboards', breadcrumb: 'Dashboards > Edit', name: 'dashboards_edit' }
            })
            .state('visualboards', {
                url: '/visualboards',
                templateUrl: 'visualboards/index.html',
                controller: 'Visualboards.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'visualboards', breadcrumb: 'Visualboards' }
            })
            .state('visualboards_view', {
                url: '/visualboards/view',
                templateUrl: 'visualboards/visualboards.view.html',
                controller: 'Visualboards.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'visualboards', breadcrumb: 'Visualboards > View', name: 'visualboards_view' }
            })
            .state('visualboards_edit', {
                url: '/visualboards/edit/:_id',
                templateUrl: 'visualboards/visualboards.edit.html',
                controller: 'Visualboards.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'visualboards', breadcrumb: 'Visualboards > Edit', name: 'visualboards_edit' }
            })
            .state('logic', {
                url: '/settings/logic',
                templateUrl: 'logic/index.html',
                controller: 'Logic.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'logic', breadcrumb: 'Logic Engine' }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'settings/index.html',
                controller: 'Settings.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel' }
            })
            .state('users', {
                url: '/settings/users',
                templateUrl: 'users/index.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Users' }
            })
            .state('users_view', {
                url: '/settings/users/view',
                templateUrl: 'users/users.view.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Users > View' }
            })
            .state('users_add', {
                url: '/settings/users/add',
                templateUrl: 'users/users.add.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Users > Add' }
            })
            .state('users_edit', {
                url: '/settings/users/edit/:_id',
                templateUrl: 'users/users.edit.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Users > Edit' }
            })
            .state('clients', {
                url: '/settings/clients',
                templateUrl: 'clients/index.html',
                controller: 'Clients.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Clients' }
            })
            .state('clients_view', {
                url: '/settings/clients/view',
                templateUrl: 'clients/clients.view.html',
                controller: 'Clients.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Clients > View' }
            })
            .state('clients_add', {
                url: '/settings/clients/add',
                templateUrl: 'clients/clients.add.html',
                controller: 'Clients.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Clients > Add' }
            })
            .state('clients_edit', {
                url: '/settings/clients/edit/:_id',
                templateUrl: 'clients/clients.edit.html',
                controller: 'Clients.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Clients > Edit' }
            })
            .state('sites', {
                url: '/settings/sites',
                templateUrl: 'sites/sites.view.html',
                controller: 'Sites.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Sites' }
            })
            .state('sites_view', {
                url: '/settings/sites/view',
                templateUrl: 'sites/sites.view.html',
                controller: 'Sites.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Sites > View' }
            })
            .state('sites_add', {
                url: '/settings/sites/add',
                templateUrl: 'sites/sites.add.html',
                controller: 'Sites.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Sites > Add' }
            })
            .state('sites_edit', {
                url: '/settings/sites/edit/:_id',
                templateUrl: 'sites/sites.edit.html',
                controller: 'Sites.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Sites > Edit' }
            })
            .state('facilities', {
                url: '/settings/facilities',
                templateUrl: 'facilities/index.html',
                controller: 'Facilities.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Facilities' }
            })
            .state('facilities_view', {
                url: '/settings/facilities/view',
                templateUrl: 'facilities/facilities.view.html',
                controller: 'Facilities.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Facilities > View' }
            })
            .state('facilities_add', {
                url: '/settings/facilities/add',
                templateUrl: 'facilities/facilities.add.html',
                controller: 'Facilities.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Facilities > Add' }
            })
            .state('facilities_edit', {
                url: '/settings/facilities/edit/:_id',
                templateUrl: 'facilities/facilities.edit.html',
                controller: 'Facilities.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Facilities > Edit' }
            })
            .state('account', {
                url: '/settings/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Account' }
            })
            .state('account_reset', {
                url: '/settings/account/reset',
                templateUrl: 'account/account.reset.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Account > Reset' }
            })
            .state('themes', {
                url: '/settings/themes',
                templateUrl: 'themes/index.html',
                controller: 'Themes.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'themes', breadcrumb: 'Control Panel > Themes' }
            })
            .state('reports', {
                url: '/reports',
                templateUrl: 'reports/index.html',
                controller: 'Reports.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'reports', breadcrumb: 'Reports' }
            })
            .state('reports_facility_stats', {
                url: '/reports/facilitystats/view',
                templateUrl: 'reports/report.facilitystats.view.html',
                controller: 'Reports.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Reports > Facility Statistics' }
            })
            .state('reports_mqtt_client', {
                url: '/reports/mqtt/view',
                templateUrl: 'reports/report.mqttClient.view.html',
                controller: 'Reports.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'settings', breadcrumb: 'Control Panel > Reports > MQTT Client' }
            })
            .state('support', {
                url: '/support',
                templateUrl: 'support/index.html',
                controller: 'Support.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'support' }
            });
    }

    function run($http, $rootScope, $window, $state, $transitions, ClientService, UserService, MqttClient, FlashService, WidgetFactory) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        //get current user then init mqtt client with appropriate user rights
        UserService.GetCurrent().then(function (user) {
            $rootScope.selWidgetSettings = JSON.stringify([
                { "key": "general", "name": "General", "type": "header" },
                { "key": "name", "name": "Name", "type": "text", "value": "New Widget", "min": 0, "max": 10 },
                { "key": "description", "name": "Description", "value": "N/A", "type": "text", "min": 0, "max": 50 },
                { "key": "border", "name": "Border", "value": true, "type": "bool" },
                { "key": "backgroundColour", "name": "Background Colour", "value": "#FFFFFF", "type": "colour" },
                { "key": "header", "name": "Header", "type": "header" },
                { "key": "headerVisible", "name": "Visible", "value": true, "type": "bool" },
                { "key": "headerText", "name": "Text", "value": "Header Text", "type": "text", "min": 0, "max": 10 },
                { "key": "headerBorder", "name": "Border", "value": true, "type": "bool" }, { "key": "headerBackgroundColour", "name": "Background Colour", "value": "#005CB8", "type": "colour" },
                { "key": "headerAlignment", "name": "Horizantal Alignment", "value": 2, "type": "select", "options": [{ "text": "Left Aligned", "value": 1, "icon": "fa fa-align-left" }, { "text": "Centre Aligned", "value": 2, "icon": "fa fa-align-center" }, { "text": "Right Aligned", "value": 3, "icon": "fa fa-align-right" }] },
                { "key": "headerFontSize", "name": "Font : Size", "value": 14, "type": "number", "min": 0, "max": 100 },
                { "key": "headerFontColor", "name": "Font : Colour", "value": "#FFFFFF", "type": "colour" }, { "key": "headerFontStyle", "name": "Font : Style", "type": "text" }, { "key": "body", "name": "Body", "type": "header" },
                { "key": "bodyBorder", "name": "Border", "value": true, "type": "bool", "min": 0, "max": 1 },
                { "key": "bodyBackgroundColour", "name": "Background Colour", "value": "#FFFFFF", "type": "colour", "min": 0, "max": 1 },
                { "key": "bodyValueVisible", "name": "Value : Visible", "value": true, "type": "bool" },
                { "key": "bodyValueSize", "name": "Value : Size", "value": 36, "type": "number", "min": 0, "max": 100 },
                { "key": "bodyValueStyle", "name": "Value : Style", "type": "text" },
                { "key": "bodyIconVisible", "name": "Icon : Visible", "value": true, "type": "bool" },
                { "key": "bodyIconSize", "name": "Icon : Size", "value": 28, "type": "number", "min": 0, "max": 100 },
                { "key": "bodyIconStyle", "name": "Icon : Style", "type": "text" },
                { "key": "bodyStateTable", "name": "State & Animation Settings", "value": "", "type": "button" },
                { "key": "footer", "name": "Footer", "type": "header" },
                { "key": "footerVisible", "name": "Visible", "value": true, "type": "bool" },
                { "key": "footerText", "name": "Text", "value": "Footer Text", "type": "text", "min": 0, "max": 10 },
                { "key": "footerBorder", "name": "Border", "value": true, "type": "bool" },
                { "key": "footerBackgroundColour", "name": "Background Colour", "value": "#005CB8", "type": "colour" },
                { "key": "footerHorizantalAlignment", "name": "Horizantal Alignment", "value": 2, "type": "select", "options": [{ "text": "Left Aligned", "value": 1, "icon": "fa fa-align-left" }, { "text": "Centre Aligned", "value": 2, "icon": "fa fa-align-center" }, { "text": "Right Aligned", "value": 3, "icon": "fa fa-align-right" }] },
                { "key": "footerFontSize", "name": "Font : Size", "value": 14, "type": "number", "min": 0, "max": 100 },
                { "key": "footerFontColor", "name": "Font : Colour", "value": "#FFFFFF", "type": "colour" },
                { "key": "footerFontStyle", "name": "Font : Style", "type": "text" }]);
            $rootScope.loggedInUser = user;
            FlashService.Success('Welcome ' + user.firstName + ', you have successfully logged in.', 'User Sign-On : Success', user.profileImage);

            //init mqtt connection & subscribe to topics
            initMqtt(FlashService, ClientService, MqttClient, user);
        });

        $transitions.onSuccess({}, function ($transition) {
            //console.log($transition.$from());
            //console.log($transition.$to().name);
            //console.log($transition.params());
            $rootScope.activeTab = $transition.$to().data.activeTab;
            $rootScope.currentState = $transition.$to();
        });

        function initMqtt(FlashService, ClientService, MqttClient, user) {
            $rootScope.mqtt = {};
            $rootScope.mqtt.subscribedTopics = {};
            $rootScope.mqtt.subscribedTopicCount = 0;
            $rootScope.mqtt.serverUrl = user.organisation[0].mqttServerUrl;
            $rootScope.mqtt.clientId = user.organisation[0].mqttClientId + '_' + Math.random().toString(16).substr(2, 8)
            $rootScope.mqtt.options = {
                useSSL: true,
                cleanSession: false,
                onSuccess: successCallback,
                onFailure: errorCallback
            }

            //if platfrom admin then use mqtt admin rights
            if (user.role == 'Platform Admin.') {
                $rootScope.mqtt.options.userName = "vkliygmv";
                $rootScope.mqtt.options.password = "xoK5tix01duU";
            }
            else {
                if (user.organisation.length > 0) {
                    $rootScope.mqtt.options.userName = user.organisation[0].mqttClientId;
                    $rootScope.mqtt.options.password = user.organisation[0].mqttClientId;
                }
            }



            MqttClient.init($rootScope.mqtt.serverUrl, 34462, $rootScope.mqtt.clientId);
            MqttClient.connect($rootScope.mqtt.options);

            function subscribeMqttTopic(topicName) {
                //FlashService.Success('Subscribed to topic name ' + topicName + '.', 'MQTT Connection');
                
                console.log(topicName);
                MqttClient.subscribe(topicName);
                $rootScope.mqtt.subscribedTopics[topicName] = ['*', Date.now()];
                $rootScope.mqtt.subscribedTopicCount++;
            }

            //called when success occurs
            function successCallback() {
                // FlashService.Success('MQTT data connection was succesfully established.', 'MQTT Connection');
                // FlashService.Success('MQTT Broker : ' + $rootScope.mqtt.serverUrl, 'MQTT Connection');
                // FlashService.Success('MQTT Client Id. : ' + $rootScope.mqtt.clientId, 'MQTT Connection');

                //Get all tags for current client and subscribe to updates.
                subscribeTopics();
            }

            //called when error occures
            function errorCallback(e) {
                console.log(e);
                FlashService.Error('MQTT data connecion experienced an error.', 'MQTT Connection');
                FlashService.Error(e.errorMessage, 'MQTT Connection');
            }


            //subscribe to topics and store them in a table
            function subscribeTopics() {
                if ($rootScope.loggedInUser.role != 'Platform Admin.') {
                    ClientService.GetById($rootScope.loggedInUser.organisationId)
                        .then(function (clients, res) {
                            //transform results topic list
                            clients.forEach(client => {
                                //if any sites exist
                                if (client.sites) {
                                    for (let siteIndex = 0; siteIndex < client.sites.length; siteIndex++) {
                                        for (let facilityIndex = 0; facilityIndex < client.sites[siteIndex].children.length; facilityIndex++) {
                                            for (let deviceIndex = 0; deviceIndex < client.sites[siteIndex].children[facilityIndex].children.length; deviceIndex++) {
                                                for (let tagIndex = 0; tagIndex < client.sites[siteIndex].children[facilityIndex].children[deviceIndex].tags.length; tagIndex++) {
                                                    let topicName = client.mqttClientId + '/' + client.sites[siteIndex].children[facilityIndex].children[deviceIndex].tags[tagIndex].address;
                                                    subscribeMqttTopic(topicName);
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        })
                        .catch(function (error) {
                            FlashService.Error(error);
                        });
                }
                else {
                    ClientService.GetAll()
                        .then(function (clients, res) {
                            //transform results topic list
                            clients.forEach(client => {
                                //if any sites exist
                                if (client.sites) {
                                    for (let siteIndex = 0; siteIndex < client.sites.length; siteIndex++) {
                                        for (let facilityIndex = 0; facilityIndex < client.sites[siteIndex].children.length; facilityIndex++) {
                                            for (let deviceIndex = 0; deviceIndex < client.sites[siteIndex].children[facilityIndex].children.length; deviceIndex++) {
                                                for (let tagIndex = 0; tagIndex < client.sites[siteIndex].children[facilityIndex].children[deviceIndex].tags.length; tagIndex++) {
                                                    let topicName = client.mqttClientId + '/' + client.sites[siteIndex].children[facilityIndex].children[deviceIndex].tags[tagIndex].address;
                                                    subscribeMqttTopic(topicName);
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                            FlashService.Success('Subscribed and monitoring data for ' + $rootScope.mqtt.subscribedTopicCount + ' topics / data points.', 'MQTT Connection');
                        })
                        .catch(function (error) {
                            FlashService.Error(error);
                        });
                }
            }
        }
    }



    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['app']);
        });
    });
})();
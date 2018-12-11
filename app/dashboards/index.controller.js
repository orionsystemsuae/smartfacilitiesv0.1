(function () {
    'use strict';

    angular
        .module('app')
        .controller('Dashboards.IndexController', Controller);

    function Controller($scope, $rootScope, $state, $stateParams, $moment, $window, $interval, UserService, DashboardService, MetricsService, FlashService, WidgetFactory) {
        var vm = this;
        $scope.datapointsWC = [];
        $scope.datapointsWB = [];
        $scope.datapointsUR = [];

        $scope.datacolumns = [{ "id": "top-1", "type": "bar", "name": "Series A" }];
        $scope.datax = { "id": "x" };
        vm.iconText = "";
        vm.itemsByPage = 5;
        $scope.state = $state;
        $scope.myTextFun = function name() {
            return "My name is: <h1>John Doe</h1>";
        }
        // console.log('timezone', $moment().tz("Asia/Dubai").format());
        //var timeZones = $moment.tz.names();
        //console.log('zones', timeZones);

        $scope.$on('gridster-item-resized', function (item) {
            // item.$element
            // item.gridster
            // item.row
            // item.col
            // item.sizeX
            // item.sizeY
            // item.minSizeX
            // item.minSizeY
            // item.maxSizeX
            // item.maxSizeY
            console.log('gridster-item-resized', item);
        })

        $scope.GetDataArray= function(key)
        {
            if(key == 'WC')
            return $scope.datapointsWC;
            else if(key == 'WB')
            return $scope.datapointsWB;
            else if(key == 'UR')
            return $scope.datapointsUR;
        }
        // Retrive specified widget setting
        $scope.GetWidgetSetting = function (widget, key) {
            var resultArr = widget.config.settings.filter(function (item) {
                return (item['key'] === key);
            });
            if (resultArr.length > 0) {
                if (resultArr[0].value != undefined || resultArr[0] != null)
                    return resultArr[0].value;
            }
            //if nothing found
            return '';
        }

        // Check if the topic exists in user scope and has access to it
        $scope.IsTopicValid = function (topicAddress) {
            //console.log('topics', $rootScope.mqtt.subscribedTopics);
            if ($rootScope.mqtt.subscribedTopics[topicAddress] != undefined)
                if ($rootScope.mqtt.subscribedTopics[topicAddress] != null)
                    return true
            //if nothing found
            return false;
        }

        // Retrieve the last updated topic value
        $scope.GetTopicValue = function (topicAddress) {
            // console.log(topicAddress);
            //console.log(topicAddress);
            if ($scope.IsTopicValid(topicAddress)) {
                // if (topic.graph) {
                //     if (topic.graph.values == undefined) {
                //         topic.graph.values = [];
                //         topic.graph.buffer = 15;
                //     }
                //     if (topic.graph.values.length > topic.graph.buffer)
                //         topic.graph.values = [];
                //     topic.graph.values.push(topicValue);
                // }
                return $rootScope.mqtt.subscribedTopics[topicAddress][0];
            }
            //if nothing found
            return 'VAL';
        }

        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 18, 40, 19, 86, 27, 90],
            [23, 88, 40, 19, 36, 97, 90],
            [21, 28, 40, 19, 66, 27, 90],
            [29, 8, 40, 19, 96, 67, 90],
            [25, 38, 40, 19, 16, 28, 90],
            [20, 78, 40, 19, 6, 57, 90],
        ];

        $scope.UpdateChartData = function (widget) {

            let seriesNameIndex = 0;
            let timestampArray = [];
            //widget.config.chart.series.yValues = [];

            let frequency = $scope.GetWidgetSetting(widget, 'bodyChartFrequency');
            let widgetTimezone = $scope.GetWidgetSetting(widget, 'bodyChartTimeZone');
            console.log('widgetTimezone', widgetTimezone);
            let widgetTimeStart = $scope.GetWidgetSetting(widget, 'bodyChartStartTime').time;
            let widgetTimeEnd = $scope.GetWidgetSetting(widget, 'bodyChartEndTime').time;
            //let widgetTimeStampMini = false;//$scope.GetWidgetSetting(widget, 'bodyChartTimeStampMini');
            let timeStampFormat = $scope.GetWidgetSetting(widget, 'bodyChartTimestampFormatCustom');;

            var timeStart, timeEnd, timeDiff, valueLimit;

            console.log(widgetTimeStart);
            console.log(widgetTimeEnd);




            //fill x-axis time-stamp labels, based on frequency selected
            switch (frequency) {
                case '1m': timeStart = moment.utc(widgetTimeStart, 'YYYY-MM-DDTHH:mm').format();
                    timeEnd = moment.utc(widgetTimeEnd, 'YYYY-MM-DDTHH:mm').format();
                    //time difference between start and end time
                    timeDiff = moment(timeEnd).diff(moment(timeStart), 'minutes');
                    //for minutes, total number of values = timeDiff in minutes
                    valueLimit = timeDiff;
                    //calculate mini timestamp formats
                    // if (timeDiff <= 60)
                    //     timeStampFormat = 'mm';
                    // else if (timeDiff <= 1440)
                    //     timeStampFormat = 'HH:mm';
                    // else if (timeDiff > 1440)
                    //     timeStampFormat = 'DD-MMM HH:mm'
                    //fill x-axis timestamp temporary array
                    for (var i = 0; i < valueLimit; i++) {
                        timestampArray.push(moment.utc(timeStart).add(i, 'minutes').format());
                    }
                    break;

                case '1h': timeStart = moment.utc(widgetTimeStart, 'YYYY-MM-DDTHH').format();
                    timeEnd = moment.utc(widgetTimeEnd, 'YYYY-MM-DDTHH').format();
                    //time difference between start and end time
                    timeDiff = moment(timeEnd).diff(moment(timeStart), 'hours');
                    //for hours, total number of values = timeDiff in hours
                    valueLimit = timeDiff;
                    //calculate mini timestamp formats
                    // if (timeDiff <= 24)
                    //     timeStampFormat = 'HH:mm';
                    // else if (timeDiff > 24)
                    //     timeStampFormat = 'DD-MMM HH:mm';
                    //fill x-axis timestamp temporary array
                    for (var i = 0; i < valueLimit; i++) {
                        timestampArray.push(moment.utc(timeStart).add(i, 'hours').format());
                    }
                    break;

                case '1d': timeStart = moment.utc(widgetTimeStart, 'YYYY-MM-DD').format();
                    timeEnd = moment.utc(widgetTimeEnd, 'YYYY-MM-DD').format();
                    //time difference between start and end time
                    timeDiff = moment(timeEnd).diff(moment(timeStart), 'days');
                    //for days, total number of values = timeDiff in days
                    valueLimit = timeDiff;
                    //mini Timestamp format
                    //timeStampFormat = 'DD-MMM';
                    for (var i = 0; i < valueLimit; i++) {
                        timestampArray.push(moment.utc(timeStart).add(i, 'days').format());
                    }
                    break;
            }

            // console.log('timeStart', timeStart);
            // console.log('timeEnd', timeEnd);
            // console.log('timeDiff', timeDiff);

            //retrive data for all topics / series one by one
            widget.config.topics.forEach(topic => {
                //DA_UN404VVVr/DA/DXB/CBDLTLTGM/WC1/PS
                if ($scope.IsTopicValid(topic.address)) {
                    MetricsService.GetSeries(topic.address, timeStart, timeEnd, frequency)
                        .then(function (result, res) {
                            if (result.results != undefined) {
                                if (result.results.length > 0) {
                                    if (result.results[0].series != undefined) {
                                        if (result.results[0].series.length > 0) {
                                            let resultColumns = result.results[0].series[0].columns;
                                            let resultValues = result.results[0].series[0].values;
                                            Object.keys(topic.metrics).forEach(metric => {
                                                let metricIndex = resultColumns.indexOf(metric);
                                                let valuesArray = [];
                                                //console.log('metric', metric);
                                                //check if metric enabled
                                                if (topic.metrics[metric] == true) {
                                                    widget.config.chart.series.names[seriesNameIndex++] = topic.label + ' : ' + metric.toUpperCase();

                                                    for (var i = 0; i < valueLimit; i++) {
                                                        //check if value for this time stamp exists
                                                        if (resultValues.length > 0 && i < (timestampArray.length - 1)) {
                                                            if (timestampArray[i] == resultValues[0][0]) {
                                                                valuesArray.push(resultValues[0][metricIndex]);
                                                                resultValues.shift();
                                                            }
                                                            else
                                                                valuesArray.push(null);
                                                        }
                                                        else
                                                            valuesArray.push(null);

                                                    }

                                                    //update y-Axis value plotting
                                                    //console.log('yUpdate');
                                                    if (widget.config.chart.series.yValues.length < seriesNameIndex) {
                                                        widget.config.chart.series.yValues.push(valuesArray);
                                                    }
                                                    else {
                                                        for (var i = 0; i < valueLimit; i++)
                                                            widget.config.chart.series.yValues[seriesNameIndex - 1][i] = valuesArray[i];
                                                    }

                                                    //update X-Axis Timestamp labels
                                                    //console.log('xUpdate');
                                                    //if (widget.config.chart.series.xValues.length < timestampArray.length) {
                                                    // widget.config.chart.series.xValues = timestampArray;
                                                    // }
                                                    // else {
                                                    for (var i = 0; i < valueLimit && i < widget.config.chart.series.xValues.length; i++) {
                                                        widget.config.chart.series.xValues[i] = moment.utc(timestampArray[i]).tz(widgetTimezone).format(timeStampFormat);
                                                    }
                                                    //  }

                                                    //re-initilize time for next metric iteration, currently only for minute, needs to change for all
                                                    timeStart = moment.utc(widgetTimeStart, 'YYYY-MM-DDTHH:mm').format();
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        // null values if entire series does not contain any value
                                        Object.keys(topic.metrics).forEach(metric => {
                                            let valuesArray = [];
                                            if (topic.metrics[metric] == true) {
                                                widget.config.chart.series.names[seriesNameIndex++] = topic.label + ' : ' + metric.toUpperCase();

                                                //fill empty values
                                                for (var i = 0; i < timestampArray.length; i++) {
                                                    valuesArray.push(null);

                                                    //re-initilize time for next metric iteration
                                                    timeStart = moment.utc(widgetTimeStart, 'YYYY-MM-DDTHH:mm').format();

                                                    if (widget.config.chart.series.yValues.length < seriesNameIndex)
                                                        widget.config.chart.series.yValues.push(valuesArray);
                                                    else {
                                                        for (var i = 0; i < valueLimit; i++)
                                                            widget.config.chart.series.yValues[seriesNameIndex - 1][i] = null;
                                                    }
                                                }
                                            }
                                        });
                                        console.log('No data found for :' + topic.address);
                                    }
                                }
                            }
                        })
                        .catch(function (error) {
                            FlashService.Error(error, 'Dashboard : Fetch - Series');
                            console.error(error);
                        });
                }
                else
                    console.log('Topic address is invalid. Or Mqtt connection not yet initilized.' + topic.address);
            });
        }

        $scope.randomize = function (widget, dataArray) {
            //console.log('before', dataArray);
            widget.config.chart.series.yValues = dataArray.map(function (data) {
                var newArray = data.map(function (y) {
                    y = y + Math.random() * 10 - 5;
                    return parseInt(y < 0 ? 0 : y > 100 ? 100 : y);
                });
                newArray.length++;
                newArray[6] = 200;
                return newArray;
            });
            //console.log('after', dataArray);

        };

        // Retrieve the last calculated Formula value
        $scope.AddToInlineGraph = function (topic, evaluatedValue) {
            if (topic.graph) {
                if (topic.graph.show) {
                    if (topic.graph.values == undefined) {
                        topic.graph.values = [];
                        topic.graph.buffer = 15;
                    }

                    //if buffer full remove first value
                    while (topic.graph.values.length > topic.graph.buffer)
                        topic.graph.values.shift();

                    //if same value repeated no need to update
                    if (topic.graph.values.length > 0) {
                        if (topic.graph.values[topic.graph.values.length - 1] != evaluatedValue) {
                            if (lib.Parse.isNumeric(evaluatedValue)) {
                                topic.graph.values.push(lib.Parse.parseFloat(evaluatedValue));
                                console.log(topic.address, evaluatedValue);
                            }
                        }
                    }
                    else {
                        if (lib.Parse.isNumeric(evaluatedValue)) {
                            topic.graph.values.push(lib.Parse.parseFloat(evaluatedValue));
                            console.log(topic.address, evaluatedValue);
                        }
                    }
                }
            }
        }



        //library object
        var lib = {};
        //library Math functions
        lib.Math = window.Math;

        //library Time functions
        lib.Timer = {};
        lib.Timer.momment = $moment();
        lib.Timer.Date = new Date();
        lib.Timer.now = Date.now();

        //library Parse functions
        lib.Parse = {};
        lib.Parse.isNumeric = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        lib.Parse.parseInt = parseInt;
        lib.Parse.parseFloat = parseFloat;
        lib.Parse.parseBool = function (value) {
            var bool = (function () {
                switch (false) {
                    case value.toLowerCase() !== 'true':
                        return true;
                    case value.toLowerCase() !== '1':
                        return true;
                    case value.toLowerCase() !== 'false':
                        return false;
                    case value.toLowerCase() !== '0':
                        return false;
                }
            })();
            if (typeof bool === "boolean") {
                return bool;
            }
            return void 0;
        };

        // lib.Val = function (topicAddress) {
        //     let result = $scope.GetTopicValue(topicAddress);
        //     result = result == 'VAL' ? undefined : result;
        //     return result;
        // }

        lib.Topic = function (topicAddress) {
            if ($scope.IsTopicValid(topicAddress))
                return {
                    address: topicAddress,
                    value: $rootScope.mqtt.subscribedTopics[topicAddress][0],
                    timestamp: $rootScope.mqtt.subscribedTopics[topicAddress][1],
                }
            //if nothing found
            return {};
        }

        //evaluate all widget formulas
        var timerWidgetFormulas = $interval(function () {
            if (vm.dashboard != undefined)
                vm.dashboard.widgets.forEach(widget => {
                    widget.config.topics.forEach(topic => {
                        //if tag
                        if (topic.type == 1) {
                            topic.value = lib.Topic(topic.address).value;
                            $scope.AddToInlineGraph(topic, topic.value);
                            // console.log(topic.address, topic.value);
                        }
                        //if formula
                        if (topic.type == 2) {
                            topic.value = eval(topic.address);
                            $scope.AddToInlineGraph(topic, topic.value);
                        }
                    });
                });
        }, 1000);

        $scope.$on('$destroy', function () {
            if (timerWidgetFormulas)
                $interval.cancel(timerWidgetFormulas);
        });

        //evaluate all chart widget relative datetimes & chart data
        var timerChartUpdates = $interval(function () {
            if (vm.dashboard != undefined)
                vm.dashboard.widgets.forEach(widget => {
                    //console.log(widget.typeId);
                    //console.log(widget.type);

                    if (widget.typeId == 'chartTile') {
                        //console.log(1);
                        //change widget refresh rate from seconds to millliseconds
                        let refreshCounterMS = $scope.GetWidgetSetting(widget, 'bodyChartRefreshRate') * 1000;

                        //check if first refresh
                        if (widget.refreshCounter == undefined)
                            widget.refreshCounter = refreshCounterMS;

                        //if time to refresh arrived or first time
                        if (widget.refreshCounter <= 0 || widget.refreshCounter == refreshCounterMS) {

                            //start date time
                            var startDateSetting = $scope.GetWidgetSetting(widget, 'bodyChartStartTime');
                            //if add operator selected then add otherwise subtract
                            startDateSetting.time = (startDateSetting.operator ? $moment().add(startDateSetting.operand, startDateSetting.unit) : $moment().subtract(startDateSetting.operand, startDateSetting.unit)).utc().format();

                            //end date time
                            var endDateSetting = $scope.GetWidgetSetting(widget, 'bodyChartEndTime');
                            //if add operator selected then add otherwise subtract
                            endDateSetting.time = (endDateSetting.operator ? $moment().add(endDateSetting.operand, endDateSetting.unit) : $moment().subtract(endDateSetting.operand, endDateSetting.unit)).utc().format();

                            //update chart
                            $scope.UpdateChartData(widget);

                            //if refresh wait expired then re-init
                            if (widget.refreshCounter <= 0)
                                widget.refreshCounter = refreshCounterMS;
                        }
                    }
                    //add end of every, decrement counter
                    widget.refreshCounter = widget.refreshCounter - 1000;
                });
        }, 1000);

        $scope.$on('$destroy', function () {
            if (timerChartUpdates)
                $interval.cancel(timerChartUpdates);
        });


        //Calculate relative date / time
        $scope.GetRelativeTime = function (dateParams) {

            if ($scope.IsTopicValid(topicAddress))
                return $rootScope.mqtt.subscribedTopics[topicAddress][1];
            //if nothing found
            return 'MM/dd/yyyy @ HH:mm:ss';
        }

        // Retrive the time for last topic value update
        $scope.GetTopicTime = function (topicAddress) {
            if ($scope.IsTopicValid(topicAddress))
                return $rootScope.mqtt.subscribedTopics[topicAddress][1];
            //if nothing found
            return 'MM/dd/yyyy @ HH:mm:ss';
        }

        // Get topic state for specified topic and topic value
        // In case of a unknown value retuen default state
        // In case default state doesnot exit make a default state and retuen
        $scope.GetState = function (widget, topicIndex, topicValue) {
            // if no topic value specified,t then retrive current value
            topicValue = topicValue || $scope.GetTopicValue(widget.config.topics[topicIndex].address);
            // then retrive the state associated with that value from the topic state table
            // and if no state found associated with provided value i.e. unknown value, the send back default state of the topic
            return widget.config.topics[topicIndex].stateTable.filter(function (item) {
                return (item["value"] === topicValue);
            })[0] || $scope.GetState(widget, topicIndex, 'default') || {
                    "value": "default",
                    "valueColor": "#005cb8",
                    "text": "TXT",
                    "textColor": "#005cb8",
                    "icon": "fas fa-asterisk",
                    "iconColor": "#005cb8",
                    "iconAnimation": ""
                };
        }

        // Retrive body value font style settings for the specifed widget configuration 
        // These are placed in class attribute
        $scope.GetStateValueStyle = function (widget) {
            // retrive config settings
            var settingBold = $scope.GetWidgetSetting(widget, 'bodyValueStyle').bold ? ' font-weight-bold' : '';
            var settingItalic = $scope.GetWidgetSetting(widget, 'bodyValueStyle').italic ? ' font-italic' : '';
            var settingUnderline = $scope.GetWidgetSetting(widget, 'bodyValueStyle').underline ? ' font-underline' : '';
            // concat result string
            var result = '';
            result = result.concat(settingBold, settingItalic, settingUnderline);
            return result;
        }

        // Retrive body value size and color settings for the specifed widget configuration
        // These are placed in style attribute
        $scope.GetStateValueColorSize = function (widget, topicIndex, value) {
            // retive state
            var state = $scope.GetState(widget, topicIndex, value);
            // retrive config setting
            var fontSize = $scope.GetWidgetSetting(widget, 'bodyValueSize');
            // concat result string
            var result = '';
            result = result.concat('font-size:', fontSize, 'px; ', 'color:', state.valueColor, ';');
            return result;
        }

        // Retrive body icon font style settings for the specifed widget configuration 
        // These are placed in class attribute
        $scope.GetStateIconStyle = function (widget, topicIndex, value) {
            // retrive config settings
            var settingBold = $scope.GetWidgetSetting(widget, 'bodyIconStyle').bold ? ' font-weight-bold' : '';
            var settingItalic = $scope.GetWidgetSetting(widget, 'bodyIconStyle').italic ? ' font-italic' : '';
            var settingUnderline = $scope.GetWidgetSetting(widget, 'bodyIconStyle').underline ? ' font-underline' : '';
            // retive state
            var state = $scope.GetState(widget, topicIndex, value);
            // concat result string
            var result = '';
            result = result.concat(state.icon, ' ', state.iconAnimation, ' ', settingBold, settingItalic, settingUnderline);
            return result;
        }

        // Retrive body icon for the specifed widget configuration 
        // It is placed in class attribute
        $scope.GetStateIcon = function (widget, topicIndex, value) {
            // retive state
            var state = $scope.GetState(widget, topicIndex, value);
            // concat result string
            var result = '';
            result = result.concat(' ', state.icon, ' ', state.iconAnimation);
            return result;
        }

        // Retrive body icon font color & size settings for the specifed widget configuration 
        // These are placed in style attribute
        $scope.GetStateIconColorSize = function (widget, topicIndex, value) {
            // retive state
            //console.log('widget' , widget);
            //console.log('topicIndex' , topicIndex);
            //console.log('value' , value);

            var state = $scope.GetState(widget, topicIndex, value);
            //console.log('state' , state);
            // retrive config settings
            var iconSize = $scope.GetWidgetSetting(widget, 'bodyIconSize');
            // concat result string
            var result = '';
            // result = result.concat('font-size:', iconSize, 'px; ', 'color:', state.iconColor, ';');

            result = result.concat('color:', state.iconColor, ';');
            return result;
        }

        // Retrive body text font style settings for the specifed widget configuration 
        // These are placed in class attribute
        $scope.GetStateTextStyle = function (widget) {
            // retive state
            var settingBold = $scope.GetWidgetSetting(widget, 'bodyTextStyle').bold ? ' font-weight-bold' : '';
            var settingItalic = $scope.GetWidgetSetting(widget, 'bodyTextStyle').italic ? ' font-italic' : '';
            var settingUnderline = $scope.GetWidgetSetting(widget, 'bodyTextStyle').underline ? ' font-underline' : '';
            // concat result string
            var result = '';
            result = result.concat(settingBold, settingItalic, settingUnderline);
            return result;
        }

        // Retrive body text font color & size settings for the specifed widget configuration 
        // These are placed in style attribute
        $scope.GetStateTextColorSize = function (widget, topicIndex, value) {
            // retive state
            var state = $scope.GetState(widget, topicIndex, value);
            // retrive config settings
            var fontSize = $scope.GetWidgetSetting(widget, 'bodyTextSize');
            // concat result string
            var result = '';
            result = result.concat('font-size:', fontSize, 'px; ', 'color:', state.textColor, ';');
            return result;
        }

        // Retrive body text for the specifed widget configuration 
        $scope.GetStateText = function (widget, topicIndex, value) {
            // retive state
            var state = $scope.GetState(widget, topicIndex, value);
            //return result
            return state.text;
        }



        // console.log(WidgetFactory.GetAnimationList());
        // console.log(WidgetFactory.CreateInformationTile().GetSetting('footerFontColor'));

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
        vm.selectWidget = selectWidget;
        vm.editWidget = editWidget;
        vm.removeWidget = removeWidget;
        vm.duplicateWidget = duplicateWidget;
        vm.addTopic = addTopic;
        vm.removeTopic = removeTopic;
        vm.duplicateTopic = duplicateTopic;
        vm.addState = addState;
        vm.removeState = removeState;
        vm.editStateIcon = editStateIcon;
        vm.saveDashboard = saveDashboard;
        //vm.updateDashboard = updateDashboard;
        vm.deleteDashboard = deleteDashboard;
        vm.pinDashboard = pinDashboard;
        vm.clearAllWidgets = clearAllWidgets;
        vm.pageState = "add";
        vm.animations = WidgetFactory.GetAnimationList();

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
                    vm.dashboard = WidgetFactory.CreateDashboard();
                    vm.dashboard.organisationId = $rootScope.loggedInUser.organisationId;
                    vm.dashboard.createdBy = $rootScope.loggedInUser._id;
                    // console.log(vm.dashboard);
                }
                // $scope.$watch('vm.variablename', function (newVal, oldVal) {

                // });
            });
        }

        //Get All Dashboards
        function GetAllDashboards() {
            // if ($rootScope.loggedInUser.role != 'Platform Admin.') {

            //retrive private dashboards
            DashboardService.GetPrivateByUserId($rootScope.loggedInUser._id)
                .then(function (dashboardsPrivate, res) {
                    vm.dashboardsPrivate = dashboardsPrivate;
                    vm.loadingPrivateDashboards = false;
                })
                .catch(function (error) {
                    FlashService.Error(error, 'Dashboard : Fetch - Private');
                    vm.loadingPrivateDashboards = false;
                });

            //retrive shared dashboards
            DashboardService.GetSharedByUserId($rootScope.loggedInUser._id)
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
            vm.selectedWidgetIndex = -1;
            vm.selectedTopicIndex = -1;
            vm.selectedTopicStateIndex = -1;
        };

        //save sashboard
        function saveDashboard() {
            vm.dashboard.options.margins = [vm.dashboard.widgetSpacing, vm.dashboard.widgetSpacing];
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
                case 'infoTile':
                    addInformationTile();
                    break;
                case 'infoBoard':
                    addInformationBoard();
                    break;
                case 'weatherTile':
                    addWeatherTile(type);
                    break;
                case 'lineChartTile':
                    addChartTile('line');
                    break;
                case 'barChartTile':
                    addChartTile('bar');
                    break;
                case 'horizantalBarChartTile':
                    addChartTile('horizantalBar');
                    break;
                case 'pieChartTile':
                    addChartTile('pie');
                    break;
                case 'doughnutChartTile':
                    addChartTile('doughnut');
                    break;
                case 'polarChartTile':
                    addChartTile('polar');
                    break;
                case 'radarChartTile':
                    addChartTile('radar');
                    break;
                default:
                    break;
            }
        }

        //remove the selected widget on dashboard
        function removeWidget() {
            vm.dashboard.widgets.splice(vm.selectedWidgetIndex, 1);
            vm.selectedWidgetIndex = -1;
        }

        //set the selected widget on dashboard
        function selectWidget(index) {
            vm.selectedWidgetIndex = index;
        }

        //set the selected widget on dashboard and open settings panel
        function editWidget(index) {
            vm.selectedWidgetIndex = index;
            vm.selectedTopicIndex = 0;
            vm.selectedTopicStateIndex = -1;
            $('#modalSettings').modal('show');
        }

        //duplicate the selected widget on dashboard
        function duplicateWidget() {
            console.log(vm.dashboard.widgets[vm.selectedWidgetIndex]);
            vm.dashboard.widgets.push(WidgetFactory.CopyWidget(vm.dashboard.widgets[vm.selectedWidgetIndex]));
        }

        //add a new information tile widget to dashboard
        function addInformationTile() {
            vm.dashboard.widgets.push(WidgetFactory.CreateInformationTile());
            //add topic
            vm.selectedWidgetIndex = vm.dashboard.widgets.length - 1;
        };

        //add a new information board widget to dashboard
        function addInformationBoard() {
            vm.dashboard.widgets.push(WidgetFactory.CreateInformationBoard());
            //add topic
            vm.selectedWidgetIndex = vm.dashboard.widgets.length - 1;
        };

        //add a new weather tile widget to dashboard
        function addWeatherTile(type) {
            vm.dashboard.widgets.push(WidgetFactory.CreateWeatherTile());
        };

        //add a new weather tile widget to dashboard
        function addChartTile(type) {
            vm.dashboard.widgets.push(WidgetFactory.CreateChartTile(type));
            //add topic
            vm.selectedWidgetIndex = vm.dashboard.widgets.length - 1;
        };

        function addTopic() {
            //add new topic
            vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics.push(WidgetFactory.CreateTopic());
            vm.selectedTopicIndex = vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics.length - 1;
        }

        function duplicateTopic() {
            //duplicate topic
            console.log(JSON.parse(JSON.stringify(vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics[vm.selectedTopicIndex])));
            //vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics.push();
            vm.selectedTopicIndex = vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics.length - 1;

        }

        function removeTopic(topicIndex) {
            if (vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics.length > 0) {
                vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics.splice(topicIndex, 1);
                vm.selectedTopicIndex = vm.selectedTopicIndex - 1;
            }
        }

        function addState(topicIndex) {
            vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics[topicIndex].stateTable.push({
                "value": "default",
                "valueColor": "#005cb8",
                "text": "TXT",
                "textColor": "#005cb8",
                "icon": "fas fa-asterisk",
                "iconColor": "#005cb8",
                "iconAnimation": ""
            });
        }

        function removeState(topicIndex, stateIndex) {
            vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics[topicIndex].stateTable.splice(stateIndex, 1);
        }

        function editStateIcon(topicIndex, stateIndex) {
            console.log('editStateIcon', editStateIcon);
            vm.dashboard.widgets[vm.selectedWidgetIndex].config.topics[vm.selectedTopicIndex].stateTable[vm.selectedTopicStateIndex].icon = $window.selectedIcon;
        }
    }
})();
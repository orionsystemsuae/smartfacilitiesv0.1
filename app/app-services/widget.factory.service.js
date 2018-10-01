(function () {
    'use strict';

    angular
        .module('app')
        .factory('WidgetFactory', Service);

    function Service($http, $q) {
        // private properties & functions

        //animations List
        var animationListTemplate = [
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

        //settings generic tile template
        var settingsListGenericTemplate = [
            {
                key: 'general',
                name: 'General',
                type: 'header'
            },
            {
                key: 'name',
                name: 'Name',
                type: 'text',
                value: 'New Widget',
                min: 0,
                max: 10
            },
            {
                key: 'description',
                name: 'Description',
                value: 'Description...',
                type: 'text',
                min: 0,
                max: 50
            },
            {
                key: 'borderWidth',
                name: 'Border : Width',
                value: 1,
                type: 'number',
                min: 0,
                max: 10
            },
            {
                key: 'borderColour',
                name: 'Border : Colour',
                value: '#005CB8',
                type: 'colour'
            },
            {
                key: 'borderStyle',
                name: 'Border : Style',
                value: 'solid',
                type: 'select',
                options: [
                    {
                        text: 'Solid', value: 'solid', icon: '_'
                    },
                    {
                        text: 'Dotted', value: 'dotted', icon: '...'
                    },
                    {
                        text: 'Dashed', value: 'dashed', icon: '---'
                    },
                    {
                        text: 'Double', value: 'double', icon: '---'
                    },
                    {
                        text: 'Groove', value: 'groove', icon: '---'
                    },
                    {
                        text: 'Ridge', value: 'ridge', icon: '---'
                    },
                    {
                        text: 'Inset', value: 'inset', icon: '---'
                    },
                    {
                        text: 'Outset', value: 'outset', icon: '---'
                    },
                    {
                        text: 'None', value: 'none', icon: '---'
                    }
                ]
            },
            {
                key: 'header',
                name: 'Header',
                type: 'header'
            },
            {
                key: 'headerVisible',
                name: 'Visible',
                value: true,
                type: 'bool'
            },
            {
                key: 'headerText',
                name: 'Text',
                value: 'Header Text',
                type: 'text',
                min: 0,
                max: 10
            },
            {
                key: 'headerBgColour',
                name: 'Background Colour',
                value: '#005CB8',
                type: 'colour'
            },
            {
                key: 'headerAlignment',
                name: 'Horizantal Alignment',
                value: 'text-center',
                type: 'selectButtons',
                options: [
                    {
                        title: 'Left Aligned', text: '', value: 'text-left', icon: 'fas fa-fw fa-align-left'
                    },
                    {
                        title: 'Centre Aligned', text: '', value: 'text-center', icon: 'fas fa-fw fa-align-center'
                    },
                    {
                        title: 'Right Aligned', text: '', value: 'text-right', icon: 'fas fa-fw fa-align-right'
                    }
                ]
            },
            {
                key: 'headerFontSize',
                name: 'Font : Size',
                value: 14,
                type: 'number',
                min: 0,
                max: 100
            },
            {
                key: 'headerFontColour',
                name: 'Font : Colour',
                value: '#FFFFFF',
                type: 'colour'
            },
            {
                key: 'headerFontStyle',
                name: 'Font : Style',
                type: 'fontstyle',
                value: {}
            },
            {
                key: 'body',
                name: 'Body',
                type: 'header'
            },
            {
                key: 'bodyStateTable',
                name: 'Topic(s)',
                value: 'Edit Topic(s): ',
                type: 'modal-button',
                target: '#modalInfoTileTopicSettings',
                backdrop: 'false',
                icon: 'fas fa-tags'
            },
            {
                key: 'bodyBgColour',
                name: 'Background Colour',
                value: '#FFFFFF',
                type: 'colour',
                min: 0,
                max: 1
            },
            {
                key: 'bodyValueVisible',
                name: 'Value : Visible',
                value: true,
                type: 'bool'
            },
            {
                key: 'bodyValueSize',
                name: 'Value : Size',
                value: 36,
                type: 'number',
                min: 0,
                max: 100
            },
            {
                key: 'bodyValueStyle',
                name: 'Value : Style',
                type: 'fontstyle',
                value: {}
            },
            {
                key: 'bodyIconVisible',
                name: 'Icon : Visible',
                value: true,
                type: 'bool'
            },
            {
                key: 'bodyIconSize',
                name: 'Icon : Size',
                value: 28,
                type: 'number',
                min: 0,
                max: 9999999
            },
            {
                key: 'bodyIconStyle',
                name: 'Icon : Style',
                type: 'fontstyle',
                value: {}
            },
            {
                key: 'iconVerticalAlignment',
                name: 'Icon : Vertical Alignment',
                value: 1,
                type: 'selectButtons',
                options: [
                    {
                        title: 'Superscript', text: '', value: 1, icon: 'fas fa-fw fa-superscript'
                    },
                    {
                        title: 'Subscript', text: '', value: 2, icon: 'fas fa-fw fa-subscript'
                    },
                    {
                        title: 'Standard', text: '', value: 3, icon: 'fas fa-fw fa-font'
                    }
                ]
            },
            {
                key: 'bodyTextVisible',
                name: 'Text : Visible',
                value: true,
                type: 'bool'
            },
            {
                key: 'bodyTextSize',
                name: 'Text : Size',
                value: 18,
                type: 'number',
                min: 0,
                max: 100
            },
            {
                key: 'bodyTextStyle',
                name: 'Text : Style',
                type: 'fontstyle',
                value: {}
            },
            {
                key: 'footer',
                name: 'Footer',
                type: 'header'
            },
            {
                key: 'footerVisible',
                name: 'Visible',
                value: true,
                type: 'bool'
            },
            {
                key: 'footerContentType',
                name: 'Content Type',
                value: '1',
                type: 'select',
                options: [
                    {
                        text: 'Date-Time', value: '1', icon: 'fas fa-clock'
                    },
                    {
                        text: 'Text', value: '2', icon: 'fas fa-font'
                    }
                ]
            },
            {
                key: 'footerText',
                name: 'Text',
                value: 'Footer Text',
                type: 'text',
                min: 0,
                max: 999999
            },
            {
                key: 'footerBgColour',
                name: 'Background Colour',
                value: '#005CB8',
                type: 'colour'
            },
            {
                key: 'footerAlignment',
                name: 'Horizantal Alignment',
                value: 'text-center',
                type: 'selectButtons',
                options: [
                    {
                        title: 'Left Aligned', text: '', value: 'text-left', icon: 'fas fa-fw fa-align-left'
                    },
                    {
                        title: 'Centre Aligned', text: '', value: 'text-center', icon: 'fas fa-fw fa-align-center'
                    },
                    {
                        title: 'Right Aligned', text: '', value: 'text-right', icon: 'fas fa-fw fa-align-right'
                    }
                ]
            },
            {
                key: 'footerFontSize',
                name: 'Font : Size',
                value: 12,
                type: 'number',
                min: 0,
                max: 9999999999
            },
            {
                key: 'footerFontColour',
                name: 'Font : Colour',
                value: '#FFFFFF',
                type: 'colour'
            },
            {
                key: 'footerFontStyle',
                name: 'Font : Style',
                type: 'fontstyle',
                value: {}
            }
        ];

        //settings chart tile template
        var settingsListChartTemplate = [
            {
                key: 'general',
                name: 'General',
                type: 'header'
            },
            {
                key: 'name',
                name: 'Name',
                type: 'text',
                value: 'New Chart Widget',
            },
            {
                key: 'description',
                name: 'Description',
                value: 'Description...',
                type: 'text',
            },
            {
                key: 'borderWidth',
                name: 'Border : Width',
                value: 1,
                type: 'number',
                min: 0,
                max: 9999
            },
            {
                key: 'borderColour',
                name: 'Border : Colour',
                value: '#005CB8',
                type: 'colour'
            },
            {
                key: 'borderStyle',
                name: 'Border : Style',
                value: 'solid',
                type: 'select',
                options: [
                    {
                        text: 'Solid', value: 'solid', icon: '_'
                    },
                    {
                        text: 'Dotted', value: 'dotted', icon: '...'
                    },
                    {
                        text: 'Dashed', value: 'dashed', icon: '---'
                    },
                    {
                        text: 'Double', value: 'double', icon: '---'
                    },
                    {
                        text: 'Groove', value: 'groove', icon: '---'
                    },
                    {
                        text: 'Ridge', value: 'ridge', icon: '---'
                    },
                    {
                        text: 'Inset', value: 'inset', icon: '---'
                    },
                    {
                        text: 'Outset', value: 'outset', icon: '---'
                    },
                    {
                        text: 'None', value: 'none', icon: '---'
                    }
                ]
            },
            {
                key: 'header',
                name: 'Header',
                type: 'header'
            },
            {
                key: 'headerVisible',
                name: 'Visible',
                value: true,
                type: 'bool'
            },
            {
                key: 'headerText',
                name: 'Text',
                value: 'Header Text',
                type: 'text'
            },
            {
                key: 'headerBgColour',
                name: 'Background Colour',
                value: '#005CB8',
                type: 'colour'
            },
            {
                key: 'headerAlignment',
                name: 'Horizantal Alignment',
                value: 'text-center',
                type: 'selectButtons',
                options: [
                    {
                        title: 'Left Aligned', text: '', value: 'text-left', icon: 'fas fa-fw fa-align-left'
                    },
                    {
                        title: 'Centre Aligned', text: '', value: 'text-center', icon: 'fas fa-fw fa-align-center'
                    },
                    {
                        title: 'Right Aligned', text: '', value: 'text-right', icon: 'fas fa-fw fa-align-right'
                    }
                ]
            },
            {
                key: 'headerFontSize',
                name: 'Font : Size',
                value: 14,
                type: 'number',
                min: 0,
                max: 100
            },
            {
                key: 'headerFontColour',
                name: 'Font : Colour',
                value: '#FFFFFF',
                type: 'colour'
            },
            {
                key: 'headerFontStyle',
                name: 'Font : Style',
                type: 'fontstyle',
                value: {}
            },
            {
                key: 'body',
                name: 'Body',
                type: 'header'
            },
            {
                key: 'bodyBgColour',
                name: 'Background Colour',
                value: '#FFFFFF',
                type: 'colour',
                min: 0,
                max: 1
            },
            {
                key: 'bodyChartTitle',
                name: 'Chart : Title',
                value: 'Edit Title: ',
                type: 'modal-button',
                target: '#modalChartTitleSettings',
                backdrop: 'false',
                icon: 'fas fa-font'
            },
            {
                key: 'bodyChartLegend',
                name: 'Chart : Legend',
                value: 'Edit Legend: ',
                type: 'modal-button',
                target: '#modalChartLegendSettings',
                backdrop: 'false',
                icon: 'fas fa-list'
            },
            {
                key: 'bodyChartSeriesTopics',
                name: 'Chart : Series Topic(s)',
                value: 'Edit Series: ',
                type: 'modal-button',
                target: '#modalChartTileTopicSettings',
                backdrop: 'false',
                icon: 'fas fa-tags'
            },
            {
                key: 'bodyChartSeriesColors',
                name: 'Chart : Series Labels & Colours',
                value: 'Edit Labels & Colours: ',
                type: 'modal-button',
                target: '#modalChartSeriesColorSettings',
                backdrop: 'false',
                icon: 'fas fa-paint-brush'
            },
            {
                key: 'bodyChartDataSource',
                name: 'Chart : Data Source',
                value: 2,
                type: 'selectButtons',
                options: [
                    {
                        title: 'Real-time', text: 'Real-time', value: 1, icon: ''
                    },
                    {
                        title: 'Archived', text: 'Archived', value: 2, icon: ''
                    }
                ]
            },
            {
                key: 'bodyChartStartTime',
                name: 'Chart : Start Time',
                value: {
                    time: null,
                    operator: false, // true = +, false = -
                    operand: 30,
                    unit: 'minutes', //seconds, minutes, hours, days
                    relative: true,  // true = relative, false = fixed
                },
                type: 'datetime'
            },
            {
                key: 'bodyChartEndTime',
                name: 'Chart : End Time',
                value: {
                    time: null,
                    operator: false, // true = +, false = -
                    operand: 0,
                    unit: 'minutes', //seconds, minutes, hours, days
                    relative: true,  // true = relative, false = fixed
                },
                type: 'datetime'

            },
            {
                key: 'bodyChartFrequency',
                name: 'Chart : Frequency',
                value: '1m',
                type: 'selectButtons',
                options: [
                    {
                        title: 'Day', text: 'Day', value: '1d', icon: ''
                    },
                    {
                        title: 'Hour', text: 'Hour', value: '1h', icon: ''
                    },
                    {
                        title: 'Minute', text: 'Minute', value: '1m', icon: ''
                    },
                ]
            },
            {
                key: 'bodyChartRefreshRate',
                name: 'Chart : Refresh Rate (SEC)',
                value: 10,
                type: 'number',
                min: 0.5
            },
            // {
            //     key: 'bodyChartTimestampFormatType',
            //     name: 'Chart : Time Format Type',
            //     value: '1m',
            //     type: 'selectButtons',
            //     options: [
            //         {
            //             title: 'Predefined', text: 'Predefined', value: 1, icon: ''
            //         },
            //         {
            //             title: 'Custom', text: 'Custom', value: 2, icon: ''
            //         }
            //     ]
            // },
            // {
            //     key: 'bodyChartTimestampFormatPre',
            //     name: 'Chart : Time Predefined Format',
            //     value: '',
            //     type: 'select',
            //     options: [
            //         {
            //             text: 'None', value: '', icon: ''
            //         },
            //         {
            //             text: 'YYYY-MM-DD HH:mm (local)', value: 'YYYY-MM-DD HH:mm', icon: ''
            //         },
            //         {
            //             text: 'YYYY-MM-DD HH:mm Z (UTC)', value: 'YYYY-MM-DD HH:mm Z', icon: ''
            //         },
            //         {
            //             text: 'Double', value: 'double', icon: '---'
            //         },
            //         {
            //             text: 'Groove', value: 'groove', icon: '---'
            //         },
            //         {
            //             text: 'Ridge', value: 'ridge', icon: '---'
            //         },
            //         {
            //             text: 'Inset', value: 'inset', icon: '---'
            //         },
            //         {
            //             text: 'Outset', value: 'outset', icon: '---'
            //         },
            //         {
            //             text: 'None', value: 'none', icon: '---'
            //         }
            //     ]
            // },
            {
                key: 'bodyChartTimestampFormatCustom',
                name: 'Chart : Custom Time Format',
                value: '',
                type: 'text'
            },
            {
                key: 'bodyChartTimeZone',
                name: 'Chart : Time Zone',
                value: 'UTC',
                type: 'timezone'
            },
            {
                key: 'footer',
                name: 'Footer',
                type: 'header'
            },
            {
                key: 'footerVisible',
                name: 'Visible',
                value: true,
                type: 'bool'
            },
            {
                key: 'footerContentType',
                name: 'Content Type',
                value: '1',
                type: 'select',
                options: [
                    {
                        text: 'Date-Time', value: '1', icon: 'fas fa-clock'
                    },
                    {
                        text: 'Text', value: '2', icon: 'fas fa-font'
                    }
                ]
            },
            {
                key: 'footerText',
                name: 'Text',
                value: 'Footer Text',
                type: 'text',
                min: 0,
                max: 10
            },
            {
                key: 'footerBgColour',
                name: 'Background Colour',
                value: '#005CB8',
                type: 'colour'
            },
            {
                key: 'footerAlignment',
                name: 'Horizantal Alignment',
                value: 'text-center',
                type: 'selectButtons',
                options: [
                    {
                        title: 'Left Aligned', text: '', value: 'text-left', icon: 'fas fa-fw fa-align-left'
                    },
                    {
                        title: 'Centre Aligned', text: '', value: 'text-center', icon: 'fas fa-fw fa-align-center'
                    },
                    {
                        title: 'Right Aligned', text: '', value: 'text-right', icon: 'fas fa-fw fa-align-right'
                    }
                ]
            },
            {
                key: 'footerFontSize',
                name: 'Font : Size',
                value: 14,
                type: 'number',
                min: 0,
                max: 100
            },
            {
                key: 'footerFontColour',
                name: 'Font : Colour',
                value: '#FFFFFF',
                type: 'colour'
            },
            {
                key: 'footerFontStyle',
                name: 'Font : Style',
                type: 'fontstyle',
                value: {}
            }
        ];

        //state template
        var stateTemplate = {
            "value": "default",
            "valueColor": "#005cb8",
            "text": "TXT",
            "textColor": "#005cb8",
            "icon": "fas fa-asterisk",
            "iconColor": "#005cb8",
            "iconAnimation": ""
        };

        //topic template
        var widgetTopicTemplate = {
            address: "Topic/Address/Formula",
            label: "Topic",
            value: undefined,
            type: 1,   //1=tag address, //2=formula
            stateTable: [stateTemplate],
            metrics: {},
            graph: {
                show: false,
                type: "bar",  //line, bar, pie
                values: [],
                buffer: 15,
                realtime: false
            }
        }

        //widget generic template
        var widgetGenericTemplate = {
            typeId: 0,
            type: "Generic Tile",
            sizeX: 2,
            sizeY: 2,
            config: {
                topics: [widgetTopicTemplate],
                settings: settingsListGenericTemplate
            }
        }

        //widget chart template
        var widgetChartTemplate = {
            typeId: 0,
            type: "Chart Tile",
            sizeX: 1,
            sizeY: 1,
            config: {
                topics: [widgetTopicTemplate],
                settings: settingsListChartTemplate,
                chart: {
                    series: {
                        yValues: [
                            // [65, 59, 80, 81, 56, 55, 40],
                            // [28, 18, 40, 19, 86, 27, 90],
                            // [23, 88, 40, 19, 36, 97, 90],
                            // [21, 28, 40, 19, 66, 27, 90],
                            // [29, 8, 40, 19, 96, 67, 90],
                            // [25, 38, 40, 19, 16, 28, 90],
                            // [20, 78, 40, 19, 6, 57, 90],
                        ], //each inner array will be for one series
                        xValues: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'], //xValues or labels are common for all series
                        names: ['Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F', 'Series G'],
                        colors: ['#08306b', '#08519c', '#2171b5', '#4292c6', '#9ecae1', '#c6dbef', '#deebf7']
                    },
                    options: {
                        animation: {
                            duration: 0
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                boxWidth: 5,
                                fontSize: 8,
                                padding: 5,
                            }
                        },
                        title: {
                            display: true,
                            text: 'Chart Title...',
                            fontSize: 8
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        barDatasetSpacing: 1,
                        barShowStroke: false,
                        barStrokeWidth: 2,
                        barValueSpacing: 5,
                        spanGaps: true
                    }
                }

            }
        }

        //Helper Functions
        var JSONfn;
        if (!JSONfn) {
            JSONfn = {};
        }

        (function () {
            JSONfn.stringify = function (obj) {
                return JSON.stringify(obj, function (key, value) {
                    return (typeof value === 'function') ? value.toString() : value;
                });
            }

            JSONfn.parse = function (str) {
                return JSON.parse(str, function (key, value) {
                    if (typeof value != 'string') return value;
                    return (value.substring(0, 8) == 'function') ? eval('(' + value + ')') : value;
                });
            }
        }());

        //public properties and members
        var service = {};
        service.CreateDashboard = createDashboard;
        service.CreateInformationTile = createInformationTile;
        service.CreateInformationBoard = createInformationBoard;
        service.CreateChartTile = createChartTile;
        service.CreateWeatherTile = createWeatherTile;
        service.CreateTopic = createTopic;
        service.CopyWidget = copyWidget;
        service.GetAnimationList = getAnimationList;
        service.GetSetting = getSetting;
        service.SetSetting = setSetting;
        // service.GetTimeZone = getTimeZone;
        // service.GetCountries = getCountries;

        return service;

        //Topic Constructor : Create Topic
        function createTopic() {
            var newTopic = JSONfn.parse(JSONfn.stringify(widgetTopicTemplate));
            console.log(newTopic);
            return newTopic;
        }

        //Animations : Get List
        function getAnimationList() {
            return animationListTemplate;
        }

        //Widget Helper : Get Setting
        function getSetting(widget, key) {
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

        //Widget Helper : Get Setting
        function setSetting(widget, key, value) {
            var resultArr = widget.config.settings.filter(function (item) {
                return (item['key'] === key);
            });
            if (resultArr.length > 0) {
                if (resultArr[0].value != undefined || resultArr[0] != null)
                    resultArr[0].value = value;
            }
        }

        //Widget Constructor : Copy Widget
        function copyWidget(sourceWidget) {
            var newWidget = {};
            newWidget.uid = Date.now();
            newWidget.typeId = sourceWidget.typeId;
            newWidget.type = sourceWidget.type;
            newWidget.sizeX = sourceWidget.sizeX;
            newWidget.sizeY = sourceWidget.sizeY;
            newWidget.config = sourceWidget.config;
            newWidget = JSONfn.parse(JSONfn.stringify(newWidget));
            return newWidget;
        }

        //Widget Constructor : Information Tile 
        function createInformationTile() {
            var newWidget = JSONfn.parse(JSONfn.stringify(widgetGenericTemplate));
            newWidget.uid = Date.now();
            newWidget.typeId = 'infoTile';
            newWidget.type = 'Information Tile';
            return newWidget;
        }

        //Widget Constructor : Information Board 
        function createInformationBoard() {
            var newWidget = JSONfn.parse(JSONfn.stringify(widgetGenericTemplate));
            newWidget.uid = Date.now();
            newWidget.typeId = 'infoBoard';
            newWidget.type = 'Information Board';
            newWidget.sizeX = 2;
            newWidget.sizeY = 3;
            this.SetSetting(newWidget, 'bodyTextSize', 16);
            this.SetSetting(newWidget, 'bodyIconSize', 16);
            this.SetSetting(newWidget, 'bodyValueSize', 16);
            return newWidget;
        }

        //Widget Constructor : Information Chart Tile 
        function createChartTile(type) {
            var newWidget = JSONfn.parse(JSONfn.stringify(widgetChartTemplate));
            newWidget.uid = Date.now();
            newWidget.typeId = 'chartTile';
            newWidget.type = type;
            newWidget.sizeX = 5;
            newWidget.sizeY = 3;
            // this.SetSetting(newWidget, 'bodyTextSize', 16);
            // this.SetSetting(newWidget, 'bodyIconSize', 16);
            // this.SetSetting(newWidget, 'bodyValueSize', 16);
            return newWidget;
        }

        //Widget Constructor : Weather Tile 
        function createWeatherTile() {
            var newWidget = JSONfn.parse(JSONfn.stringify(widgetGenericTemplate));
            newWidget.uid = Date.now();
            newWidget.typeId = 'weatherTile';
            newWidget.sizeX = 2;
            newWidget.sizeY = 2;
            newWidget.type = 'Weather Tile';
            return newWidget;
        }

        //Dashboard Constructor : Dashboard 
        function createDashboard() {
            var newDashboard = {};
            newDashboard.name = "New Dashboard";
            newDashboard.description = "New Dashboard Description";
            newDashboard.organisationId = null;
            newDashboard.createdBy = null;
            newDashboard.type = "private";
            newDashboard.widgets = [];
            newDashboard.homepage = false;
            newDashboard.backgroundColor = "#FFFFFF";
            newDashboard.widgetSpacing = 2;
            newDashboard.options = {
                columns: 15, // the width of the grid, in columns
                rows: 10, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                //rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [2, 2], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: true, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 1, // the minimum columns the grid must have
                minRows: 2, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 1, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 1, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 1, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: true,
                    handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                    start: function (event, $element, widget) { console.log('resize-start'); console.log(widget); console.log($element); }, // optional callback fired when resize is started,
                    resize: function (event, $element, widget) { console.log('resize'); console.log(widget); console.log($element); }, // optional callback fired when item is resized,
                    stop: function (event, $element, widget) { console.log('resize-stop'); console.log(widget); console.log($element); } // optional callback fired when item is finished resizing
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    // handle: '.my-class', // optional selector for drag handle
                    start: function (event, $element, widget) { console.log('drag-start'); console.log(widget); console.log($element); }, // optional callback fired when drag is started,
                    drag: function (event, $element, widget) { console.log('drag'); console.log(widget); console.log($element); }, // optional callback fired when item is moved,
                    stop: function (event, $element, widget) { console.log('drag-stop'); console.log(widget); console.log($element); } // optional callback fired when item is finished dragging
                }

            };
            return newDashboard;
        }
    }
})();

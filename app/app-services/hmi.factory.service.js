(function () {
    'use strict';

    angular
        .module('app')
        .factory('HmiFactory', Service);

    function Service($http, $q) {
        // private properties & functions
        //Helper Functions
        // var JSONfn;
        // if (!JSONfn) {
        //     JSONfn = {};
        // }

        // (function () {
        //     JSONfn.stringify = function (obj) {
        //         return JSON.stringify(obj, function (key, value) {
        //             return (typeof value === 'function') ? value.toString() : value;
        //         });
        //     }

        //     JSONfn.parse = function (str) {
        //         return JSON.parse(str, function (key, value) {
        //             if (typeof value != 'string') return value;
        //             return (value.substring(0, 8) == 'function') ? eval('(' + value + ')') : value;
        //         });
        //     }
        // }());

        //HMI & Object Classes
        class ObjectState {
            constructor() {
                this.condition = true;
                this.icon = "fas fa-asterisk";
                this.color = "#005cb8";
                this.animation = "";
                this.animationRepeat = true;
                this.fill = false;
                this.fillColor = "#005cb8";
                this.sound = "Topic";
                this.soundRepeat = false;
                this.value = "default";
            }
        };

        class ObjectTopic {
            constructor() {
                this.address = "Topic/Address/Formula";
                this.label = "Topic";
                this.value = null;
                this.type = 1;   //1 = address, 2 = formula
                this.stateTable = [new ObjectState()];
            }
        };

        class HmiObject {
            constructor() {
                this.typeId = 0;
                this.type = "Generic Object";
                this.posX = 100;
                this.posY = 100;
                this.topic = new ObjectTopic();
                this.isSelected = false;
                this.settings = [
                    {
                        key: 'general',
                        name: 'General',
                        type: 'header'
                    },
                    {
                        key: 'name',
                        name: 'Name',
                        type: 'text',
                        value: 'New Icon',
                    },
                    {
                        key: 'description',
                        name: 'Description',
                        value: 'Description...',
                        type: 'text',
                    },
                    {
                        key: 'size',
                        name: 'Size',
                        value: 16,
                        type: 'number',
                        min: 0,
                        max: 9999999
                    },
                    {
                        key: 'stateTable',
                        name: 'Topic / Formula',
                        value: 'Edit Topic / Formula: ',
                        type: 'modal-button',
                        target: '#modalSettingsTopic',
                        backdrop: 'false',
                        icon: 'fas fa-tags'
                    },
                ];
            }
        };

        class HmiTemplate {
            constructor(name, description, organisationId, backgroundImage) {
                this.name = name;
                this.description = description;
                this.organisationId = organisationId;
                this.backgroundImage = backgroundImage;
                this.selectedObjectIndex = -1;
                this.objects = [];
            }
        };

        //animations List
        var animationListTemplate2 = [
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

        var animationListTemplate = [
            {
                "name": "Basic",
                "options": [
                    {
                        "name": "None (default)",
                        "value": ""
                    },
                    {
                        "name": "Hide",
                        "value": "d-none"
                    }
                ]
            },
            {
                "name": "Attention Seekers",
                "options": [
                    {
                        "name": "Bounce",
                        "value": "bounce"
                    },
                    {
                        "name": "Flash",
                        "value": "flash"
                    },
                    {
                        "name": "Pulse",
                        "value": "pulse"
                    },
                    {
                        "name": "Rubber Band",
                        "value": "rubberBand"
                    },
                    {
                        "name": "Shake",
                        "value": "shake"
                    },
                    {
                        "name": "Swing",
                        "value": "swing"
                    },
                    {
                        "name": "Tada",
                        "value": "tada"
                    },
                    {
                        "name": "Wobble",
                        "value": "wobble"
                    },
                    {
                        "name": "Jello",
                        "value": "jello"
                    }
                ]
            },
            {
                "name": "Bouncing Entrances",
                "options": [
                    {
                        "name": "Bounce-In",
                        "value": "bounceIn"
                    },
                    {
                        "name": "Bounce-In Down",
                        "value": "bounceInDown"
                    },
                    {
                        "name": "Bounce-In Left",
                        "value": "bounceInLeft"
                    },
                    {
                        "name": "Bounce-In Right",
                        "value": "bounceInRight"
                    },
                    {
                        "name": "Bounce-In Up",
                        "value": "bounceInUp"
                    },
                ]
            },
            {
                "name": "Bouncing Exits",
                "options": [
                    {
                        "name": "Bounce-Out",
                        "value": "bounceOut"
                    },
                    {
                        "name": "Bounce-OutDown",
                        "value": "bounceOutDown"
                    },
                    {
                        "name": "Bounce-OutLeft",
                        "value": "bounceOutLeft"
                    },
                    {
                        "name": "Bounce-OutRight",
                        "value": "bounceOutRight"
                    },
                    {
                        "name": "Bounce-OutUp",
                        "value": "bounceOutUp"
                    },
                ]
            },
            {
                "name": "Fading Entrances",
                "options": [
                    {
                        "name": "Fade-In",
                        "value": "fadeIn"
                    },
                    {
                        "name": "Fade-In Down",
                        "value": "fadeInDown"
                    },
                    {
                        "name": "Fade-In DownBig",
                        "value": "fadeInDownBig"
                    },
                    {
                        "name": "Fade-In Left",
                        "value": "fadeInLeft"
                    },
                    {
                        "name": "Fade-In LeftBig",
                        "value": "fadeInLeftBig"
                    },
                    {
                        "name": "Fade-In Right",
                        "value": "fadeInRight"
                    },
                    {
                        "name": "Fade-In RightBig",
                        "value": "fadeInRightBig"
                    },
                    {
                        "name": "Fade-In Up",
                        "value": "fadeInUp"
                    },
                    {
                        "name": "Fade-In UpBig",
                        "value": "fadeInUpBig"
                    },
                ]
            },
            {
                "name": "Fading Exits",
                "options": [
                    {
                        "name": "Fade-Out",
                        "value": "fadeOut"
                    },
                    {
                        "name": "Fade-Out Down",
                        "value": "fadeOutDown"
                    },
                    {
                        "name": "Fade-Out DownBig",
                        "value": "fadeOutDownBig"
                    },
                    {
                        "name": "Fade-Out Left",
                        "value": "fadeOutLeft"
                    },
                    {
                        "name": "Fade-Out LeftBig",
                        "value": "fadeOutLeftBig"
                    },
                    {
                        "name": "Fade-Out Right",
                        "value": "fadeOutRight"
                    },
                    {
                        "name": "Fade-Out RightBig",
                        "value": "fadeOutRightBig"
                    },
                    {
                        "name": "Fade-Out Up",
                        "value": "fadeOutUp"
                    },
                    {
                        "name": "Fade-Out Up Big",
                        "value": "fadeOutUpBig"
                    },
                ]
            },
            {
                "name": "Flippers",
                "options": [
                    {
                        "name": "Flip",
                        "value": "flip"
                    },
                    {
                        "name": "Flip-In X",
                        "value": "flipInX"
                    },
                    {
                        "name": "Flip-In Y",
                        "value": "flipInY"
                    },
                    {
                        "name": "Flip-Out X",
                        "value": "flipOutX"
                    },
                    {
                        "name": "Flip-Out Y",
                        "value": "flipOutY"
                    },
                ]
            },
            {
                "name": "Lightspeed",
                "options": [
                    {
                        "name": "LightSpeed-In",
                        "value": "lightSpeedIn"
                    },
                    {
                        "name": "LightSpeed-Out",
                        "value": "lightSpeedOut"
                    },
                ]
            },
            {
                "name": "Rotating Entrances",
                "options": [
                    {
                        "name": "Rotate-In",
                        "value": "rotateIn"
                    },
                    {
                        "name": "Rotate-In DownLeft",
                        "value": "rotateInDownLeft"
                    },
                    {
                        "name": "Rotate-In DownRight",
                        "value": "rotateInDownRight"
                    },
                    {
                        "name": "Rotate-In UpLeft",
                        "value": "rotateInUpLeft"
                    },
                    {
                        "name": "Rotate-In UpRight",
                        "value": "rotateInUpRight"
                    },
                ]
            },
            {
                "name": "Rotating Exits",
                "options": [
                    {
                        "name": "Rotate-Out",
                        "value": "rotateOut"
                    },
                    {
                        "name": "Rotate-Out DownLeft",
                        "value": "rotateOutDownLeft"
                    },
                    {
                        "name": "Rotate-Out DownRight",
                        "value": "rotateOutDownRight"
                    },
                    {
                        "name": "Rotate-Out UpLeft",
                        "value": "rotateOutUpLeft"
                    },
                    {
                        "name": "Rotate-Out UpRight",
                        "value": "rotateOutUpRight"
                    },
                ]
            },
            {
                "name": "Sliding Entrances",
                "options": [
                    {
                        "name": "Slide-In Up",
                        "value": "slideInUp"
                    },
                    {
                        "name": "Slide-In Down",
                        "value": "slideInDown"
                    },
                    {
                        "name": "Slide-In Left",
                        "value": "slideInLeft"
                    },
                    {
                        "name": "Slide-In Right",
                        "value": "slideInRight"
                    },
                ]
            },
            {
                "name": "Sliding Exits",
                "options": [
                    {
                        "name": "Slide-Out Up",
                        "value": "slideOutUp"
                    },
                    {
                        "name": "Slide-Out Down",
                        "value": "slideOutDown"
                    },
                    {
                        "name": "Slide-Out Left",
                        "value": "slideOutLeft"
                    },
                    {
                        "name": "Slide-Out Right",
                        "value": "slideOutRight"
                    },
                ]
            },
            {
                "name": "Zoom Entrances",
                "options": [
                    {
                        "name": "Zoom-In",
                        "value": "zoomIn"
                    },
                    {
                        "name": "Zoom-In Down",
                        "value": "zoomInDown"
                    },
                    {
                        "name": "Zoom-In Left",
                        "value": "zoomInLeft"
                    },
                    {
                        "name": "Zoom-In Right",
                        "value": "zoomInRight"
                    },
                    {
                        "name": "Zoom-In Up",
                        "value": "zoomInUp"
                    },
                ]
            },
            {
                "name": "Zoom Exits",
                "options": [
                    {
                        "name": "Zoom-Out",
                        "value": "zoomOut"
                    },
                    {
                        "name": "Zoom-Out Down",
                        "value": "zoomOutDown"
                    },
                    {
                        "name": "Zoom-Out Left",
                        "value": "zoomOutLeft"
                    },
                    {
                        "name": "Zoom-Out Right",
                        "value": "zoomOutRight"
                    },
                    {
                        "name": "Zoom-Out Up",
                        "value": "zoomOutUp"
                    },
                ]
            },
            {
                "name": "Specials",
                "options": [
                    {
                        "name": "Hinge",
                        "value": "hinge"
                    },
                    {
                        "name": "Jack In The Box",
                        "value": "jackInTheBox"
                    },
                    {
                        "name": "Roll-In",
                        "value": "rollIn"
                    },
                    {
                        "name": "Zoom-Out Right",
                        "value": "zoomOutRight"
                    },
                    {
                        "name": "Roll-Out",
                        "value": "rollOut"
                    },
                ]
            },
        ];



        //public properties and members
        var service = {};
        service.CreateHmi = createHmi;
        service.AddObject = addObject;
        service.DuplicateObject = duplicateObject;
        service.DeleteObject = deleteObject;
        service.AddState = addState;
        service.RemoveState = removeState;
        service.GetAnimationList = getAnimationList;

        //service.ParseHmi = parseHmi;
        //service.CopyIcon = copyIcon;
        //service.GetSetting = getSetting;
        //service.SetSetting = setSetting;
        return service;

        //Animations : Get List
        function getAnimationList() {
            return animationListTemplate;
        }

        //settings generic tile template
        // var objectSettingsTemplate = [
        //     {
        //         key: 'name',
        //         name: 'Name',
        //         type: 'text',
        //         value: 'New Icon',
        //     },
        //     {
        //         key: 'description',
        //         name: 'Description',
        //         value: 'Description...',
        //         type: 'text',
        //     },
        //     {
        //         key: 'borderVisible',
        //         name: 'Border : Visible',
        //         value: false,
        //         type: 'bool'
        //     },
        //     {
        //         key: 'borderWidth',
        //         name: 'Border : Width',
        //         value: 1,
        //         type: 'number',
        //         min: 0,
        //         max: 10
        //     },
        //     {
        //         key: 'borderColour',
        //         name: 'Border : Colour',
        //         value: '#005CB8',
        //         type: 'colour'
        //     },
        //     {
        //         key: 'borderStyle',
        //         name: 'Border : Style',
        //         value: 'solid',
        //         type: 'select',
        //         options: [
        //             {
        //                 text: 'Solid', value: 'solid', icon: '_'
        //             },
        //             {
        //                 text: 'Dotted', value: 'dotted', icon: '...'
        //             },
        //             {
        //                 text: 'Dashed', value: 'dashed', icon: '---'
        //             },
        //             {
        //                 text: 'Double', value: 'double', icon: '---'
        //             },
        //             {
        //                 text: 'Groove', value: 'groove', icon: '---'
        //             },
        //             {
        //                 text: 'Ridge', value: 'ridge', icon: '---'
        //             },
        //             {
        //                 text: 'Inset', value: 'inset', icon: '---'
        //             },
        //             {
        //                 text: 'Outset', value: 'outset', icon: '---'
        //             },
        //             {
        //                 text: 'None', value: 'none', icon: '---'
        //             }
        //         ]
        //     },
        //     {
        //         key: 'posx',
        //         name: 'Position : X-Axis',
        //         value: 50,
        //         type: 'number',
        //         readonly: true,
        //     },
        //     {
        //         key: 'posy',
        //         name: 'Position : Y Axis',
        //         value: -50,
        //         type: 'number',
        //         readonly: true,
        //     },
        //     {
        //         key: 'size',
        //         name: 'Size',
        //         value: 16,
        //         type: 'number',
        //         min: 0,
        //         max: 9999999
        //     }
        // ];

        //state template
        // var objectStateTemplate = {
        //     "condition": true,
        //     "icon": "fas fa-asterisk",
        //     "color": "#005cb8",
        //     "animation": "",
        //     "animationRepeat": true,
        //     "sound": "",
        //     "soundRepeat": false,
        // };





        //topic template
        // var objectTopicTemplate = {
        //     address: "Topic/Address/Formula",
        //     label: "Topic",
        //     value: undefined,
        //     type: 1,   //1=tag address, //2=formula
        //     stateTable: [objectStateTemplate],
        // }



        //widget generic template
        // var objectGenericTemplate = {
        //     typeId: 0,
        //     type: "Generic Object",
        //     config: {
        //         topics: [objectTopicTemplate],
        //         settings: objectSettingsTemplate,
        //     }
        // }





        // var hmiTemplate = {
        //     name : "New HMI",
        //     description : "Description...",
        //     organisationId : null,
        //     backgroundImage : null,
        //     objects : []
        // }

        //Widget Helper : Get Setting
        // function getSetting(widget, key) {
        //     var resultArr = widget.config.settings.filter(function (item) {
        //         return (item['key'] === key);
        //     });
        //     if (resultArr.length > 0) {
        //         if (resultArr[0].value != undefined || resultArr[0] != null)
        //             return resultArr[0].value;
        //     }
        //     //if nothing found
        //     return '';
        // }

        //Widget Helper : Get Setting
        // function setSetting(widget, key, value) {
        //     var resultArr = widget.config.settings.filter(function (item) {
        //         return (item['key'] === key);
        //     });
        //     if (resultArr.length > 0) {
        //         if (resultArr[0].value != undefined || resultArr[0] != null)
        //             resultArr[0].value = value;
        //     }
        // }



        //Widget Constructor : Copy Widget
        // function copyIcon(sourceIcon) {
        //     var newIcon = {};
        //     newIcon.uid = Date.now();
        //     newIcon.typeId = sourceIcon.typeId;
        //     newIcon.type = sourceIcon.type;
        //     newIcon.sizeX = sourceIcon.sizeX;
        //     newIcon.sizeY = sourceIcon.sizeY;
        //     newIcon.config = sourceIcon.config;
        //     newIcon = JSON.parse(JSON.stringify(newIcon));
        //     return newIcon;
        // }

        //Dashboard Constructor : HMI 
        function createHmi(name, description, organisationId, backgroundImage) {
            return new HmiTemplate(name, description, organisationId, backgroundImage);
        }

        //HMI Object Constructor : Icon
        function createIcon() {
            var newIcon = new HmiObject();
            newIcon.uid = Date.now();
            newIcon.typeId = 'icon';
            newIcon.type = 'Icon';
            return newIcon;
        }

        //HMI Object Constructor : Icon
        function createButton() {
            var newButton = new HmiObject();
            newButton.uid = Date.now();
            newButton.typeId = 'button';
            newButton.type = 'button';
            return newButton;
        }

        //Widget Helper : Add Object to HMI
        function addObject(hmi, objectTypeId) {
            //hmi = parseHmi(hmi)
            //hmi.addObject(objectTypeId);
            hmi.objects.push(createIcon());
            return hmi;
        }

        //Widget Helper : Add Duplicate Object to HMI
        function duplicateObject(hmi, sourceObjectIndex) {
            //hmi = parseHmi(hmi)
            // hmi.duplicateObject(objectIndex);
            var newObject = JSON.parse(angular.toJson(hmi.objects[sourceObjectIndex]));
            newObject.uid = Date.now();
            hmi.objects.push(newObject);
            return hmi;
        }

        //Widget Helper : Delete Object from HMI
        function deleteObject(hmi, objectIndex) {
            //hmi = parseHmi(hmi)
            //hmi.deleteObject(object);
            hmi.objects.splice(objectIndex, 1);
            return hmi;
        }

        //Widget Helper : Add State to HMI Object
        function addState(hmi, objectIndex) {
            //hmi = parseHmi(hmi)
            //hmi.addState(objectIndex);
            hmi.objects[objectIndex].topic.stateTable.push(new ObjectState());
            return hmi;
        }

        //Widget Helper : Remove State from HMI Object
        function removeState(hmi, objectIndex, stateIndex) {
            //hmi = parseHmi(hmi)
            //hmi.removeState(objectIndex, stateIndex);
            hmi.objects[objectIndex].topic.stateTable.splice(stateIndex, 1);
            return hmi;
        }

        //Dashboard Constructor : HMI 
        function parseHmi(hmi) {
            // check if add method missing, then add
            if (hmi.__proto__.addObject == undefined) {
                hmi.__proto__.addObject = function (objectTypeId) {
                    switch (objectTypeId) {
                        case 'icon': hmi.objects.push(createIcon()); break;
                        case 'button': hmi.objects.push(createButton()); break;
                        default: break;
                    }
                };
            }

            // check if duplicate method missing, then add
            if (hmi.__proto__.duplicateObject == undefined) {
                hmi.__proto__.duplicateObject = function (sourceObjectIndex) {
                    var newObject = JSON.parse(angular.toJson(hmi.objects[sourceObjectIndex]));
                    newObject.uid = Date.now();
                    hmi.objects.push(newObject);
                };
            }

            // check if delete method missing, then add
            if (hmi.__proto__.deleteObject == undefined) {
                hmi.__proto__.deleteObject = function (sourceObject) {
                    //var newObject = JSON.parse(JSON.stringify(sourceObject));
                    //newObject.uid = Date.now();
                    //hmi.objects.push(newObject);
                };
            }

            // check if add state missing, then add
            if (hmi.__proto__.addState == undefined) {
                hmi.__proto__.addState = function (objectIndex) {
                    hmi.objects[objectIndex].topic.stateTable.push(new ObjectState());
                };
            }

            // check if add state missing, then add
            if (hmi.__proto__.removeState == undefined) {
                hmi.__proto__.removeState = function (objectIndex, stateIndex) {
                    hmi.objects[objectIndex].topic.stateTable.splice(stateIndex, 1);
                };
            }

            return hmi;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('FlashService', Service);

    function Service($rootScope) {
        var service = {};
        service.SuccessImage = SuccessImage;
        service.Success = Success;
        service.Error = Error;

        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Success(message, title, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                title : title? '<b>' + title + '</b>': '<b>Success!</b>',
                type: 'success', 
                keepAfterLocationChange: keepAfterLocationChange
            };

            $.notify({
                title: title,
                message: message,
                icon: 'fa fa-check-circle'
            },{
                type: 'success',
                newest_on_top: true,
                animate: {
                    enter: 'animated zoomInLeft',
                    exit: 'animated zoomOutRight'
                }
            });
        }

        function SuccessImage(message, title, image, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                title : title? '<b>' + title + '</b>': '<b>Success!</b>',
                type: 'success', 
                keepAfterLocationChange: keepAfterLocationChange
            };

            $.notify({
                title: title,
                message: message,
                icon: image
            },{
                icon_type: 'image',
                type: 'success',
                newest_on_top: true,
                animate: {
                    enter: 'animated zoomInLeft',
                    exit: 'animated zoomOutRight'
                }
            });
        }

        function Error(message, title, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'danger',
                title : title? '<b>' + title + '</b>': '<b>Failure!</b>',
                keepAfterLocationChange: keepAfterLocationChange
            };

            $.notify({
                title: title,
                message: message,
                icon: 'fa fa-times-circle'
            },{
                type: 'danger',
                newest_on_top: true,
                animate: {
                    enter: 'animated zoomInLeft',
                    exit: 'animated zoomOutRight'
                }
            });
        }
    }

})();
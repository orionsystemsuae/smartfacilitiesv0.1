(function () {
  'use strict';

  angular
    .module('app')
    .directive('elementSize', function ($timeout) {
      return {
        restrict: 'EA',
        link: function ($scope, $element, $attrs) {
          console.log('ping');
          //element re-init
          var container = $element[0];
          $scope.$watchGroup([
            function () { return container.clientHeight; },
            function () { return container.clientWidth; },
            function () { return container.offsetHeight; },
            function () { return container.offsetWidth; },
          ], function (values) {
            // Handle resize event ...

            //update client size
            let clientSize = { height: values[0], width: values[1] };
            let offsetSize = { height: values[2], width: values[3] };

            console.log('resize:client(height,width)', clientSize);
            console.log('resize:offset(height,width)', offsetSize);

            //update key field, if provided
            if ($attrs.key) {
              $scope[$attrs.key] = {
                //client size
                clientHeight: clientSize.height,
                clientWidth: clientSize.width,
                //offset size
                offsetHeight: offsetSize.height,
                offsetWidth: offsetSize.width,
              };
              return;
            }
          });

          $element.resize(function () {
            //update key field, if provided
            if ($attrs.key) {
              $scope[$attrs.key] = {
                //client size
                clientHeight: container.clientHeight,
                clientWidth: container.clientWidth,
                //offset size
                offsetHeight: container.offsetHeight,
                offsetWidth: container.offsetWidth,
              };
              return;
            }
          });
        }
      };
    })
    .directive('elementDraggable', ['$document', function ($document) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          x: "=",
          y: "="
        },
        link: function ($scope, $element, $attr) {
          var startX = 0, startY = 0;
          //, x = 50, y = -50;
          console.log($scope.x, $scope.y);
          //position provided
          // if ($attr.y) {
          //   if ($attr.x) {
          //     x = $attr.x;
          //     y = $attr.y;
          //   }
          // }

          //set floating position type and coordinates
          $element.css({
            position: 'relative',
            cursor: 'pointer',
            top: $scope.y + 'px',
            left: $scope.x + 'px'
          });

          //set tooltip
          //$element.prop('title', 'Position : [' + x + ',' + y + ']');

          $element.on('mousedown', function (event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            startX = event.pageX - $scope.x;
            startY = event.pageY - $scope.y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          });

          //update coordinates if element dragged
          function mousemove(event) {
            $scope.y = event.pageY - startY;
            $scope.x = event.pageX - startX;
            // $attr.x = x;
            // $attr.y = y;
            console.log($scope.x, $scope.y)
            //update position
            $element.css({
              top: $scope.y + 'px',
              left: $scope.x + 'px'
            });

            //update tooltip
            $element.prop('title', 'Position : [' + $scope.x + ',' + $scope.y + ']');
          }

          function mouseup() {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
          }
        }
      };
    }])
    .directive('elementResizable', ['$document', function ($document) {
      return {
        link: function ($scope, $element, $attr) {
          $element.css({
            resize: 'both',
            overflow: 'hidden'
          });
        }
      };
    }])
    .directive('image', function ($q) {
      'use strict'
      var URL = window.URL || window.webkitURL;

      var getResizeArea = function () {
        var resizeAreaId = 'fileupload-resize-area';

        var resizeArea = document.getElementById(resizeAreaId);

        if (!resizeArea) {
          resizeArea = document.createElement('canvas');
          resizeArea.id = resizeAreaId;
          resizeArea.style.visibility = 'hidden';
          document.body.appendChild(resizeArea);
        }

        return resizeArea;
      }

      var resizeImage = function (origImage, options) {
        var maxHeight = options.resizeMaxHeight || 300;
        var maxWidth = options.resizeMaxWidth || 250;
        var quality = options.resizeQuality || 0.7;
        var type = options.resizeType || 'image/jpg';

        var canvas = getResizeArea();

        var height = origImage.height;
        var width = origImage.width;

        // calculate the width and height, constraining the proportions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height *= maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width *= maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        //draw image on canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(origImage, 0, 0, width, height);

        // get the data from canvas as 70% jpg (or specified type).
        return canvas.toDataURL(type, quality);
      };

      var createImage = function (url, callback) {
        var image = new Image();
        image.onload = function () {
          callback(image);
        };
        image.src = url;
      };

      var fileToDataURL = function (file) {
        var deferred = $q.defer();
        var reader = new FileReader();
        reader.onload = function (e) {
          deferred.resolve(e.target.result);
        };
        reader.readAsDataURL(file);
        return deferred.promise;
      };


      return {
        restrict: 'A',
        scope: {
          image: '=',
          resizeMaxHeight: '@?',
          resizeMaxWidth: '@?',
          resizeQuality: '@?',
          resizeType: '@?',
        },
        link: function postLink(scope, element, attrs, ctrl) {

          var doResizing = function (imageResult, callback) {
            createImage(imageResult.url, function (image) {
              var dataURL = resizeImage(image, scope);
              imageResult.resized = {
                dataURL: dataURL,
                type: dataURL.match(/:(.+\/.+);/)[1],
              };
              callback(imageResult);
            });
          };

          var applyScope = function (imageResult) {
            scope.$apply(function () {
              //console.log(imageResult);
              if (attrs.multiple)
                scope.image.push(imageResult);
              else
                scope.image = imageResult;
            });
          };


          element.bind('change', function (evt) {
            //when multiple always return an array of images
            if (attrs.multiple)
              scope.image = [];

            var files = evt.target.files;
            for (var i = 0; i < files.length; i++) {
              //create a result object for each file in files
              var imageResult = {
                file: files[i],
                url: URL.createObjectURL(files[i])
              };

              fileToDataURL(files[i]).then(function (dataURL) {
                imageResult.dataURL = dataURL;
              });

              if (scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                doResizing(imageResult, function (imageResult) {
                  applyScope(imageResult);
                });
              }
              else { //no resizing
                applyScope(imageResult);
              }
            }
          });
        }
      };
    })
    .directive('widgetUtilityWeatherTile', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/widgets/widgetUtilityWeatherTile.tpl.html',
        link: function ($scope, $element, $attrs) {

        }
      };
    })
    .directive('utilityDateNow', ['$filter', function ($filter) {
      return {
        restrict: 'EA',
        link: function ($scope, $element, $attrs) {
          $element.text($filter('date')(new Date(), $attrs.dateNow));
        }
      };
    }]);
})();

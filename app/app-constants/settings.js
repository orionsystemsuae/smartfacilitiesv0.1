(function () {
    'use strict';

    angular
        .module('app')
        .constant("appSettings", applicationSettings);

    function applicationSettings() {
        return {
            "mqttBrokerConnectionString" : "mqtt://vkliygmv:xoK5tix01duU@m11.cloudmqtt.com:14462",
            "webSocketTopic": "name"
          }
    }
})();

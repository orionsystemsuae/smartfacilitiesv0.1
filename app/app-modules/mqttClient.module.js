(function () {
  angular.module('mqttModule', []);
})();

(function () {
  'use strict';
  angular
    .module('mqttModule')
    .factory('MqttClient', Service);

  function Service($rootScope, FlashService) {
    // so we can use the member attributes inside our functions
    var client = {};
    // initialize attributes
    client._location = "";
    client._port = "";
    client._id = "";
    client._client = null;
    client._isConnected = false;

    // member functions
    client.init = init;
    client.connect = connect;
    client.disconnect = disconnect;
    client.send = send;
    client.startTrace = startTrace;
    client.stopTrace = stopTrace;
    client.subscribe = subscribe;
    client.unsubscribe = unsubscribe;

    return client;

    // onConnectionLost callback

    function _call(cb, args) {
      if (client._client) {
        cb.apply(this, args);
      } else {
        console.log('MQTT Client: Client must be initialized first.  Call init() function.');
        FlashService.Error('Client must be initialized first. Call init() function.', 'MQTT Connection : Initilization Failed');
      }
    }

    function onConnectionLost(resp) {
      console.log("MQTT Client: Connection lost on ", client._id, ", error code: ", resp);
      FlashService.Error('Connection lost on ' + client._id + ' <br>Error code: ' + resp.errorCode + ' <br>Error Message: ' + resp.errorMessage, 'MQTT Connection : Connection Failed');
      client._isConnected = false;
    }

    // connects to the MQTT Server
    function connect(options) {
      _call(_connect, [options]);
    }

    function _connect(options) {
      client._client.connect(options);
      client._isConnected = client._client.isConnected();
    }

    function disconnect() {
      _call(_disconnect);
    }

    function _disconnect() {
      client._client.disconnect();
      client._isConnected = false;
    }

    function init(location, port, id) {
      // initialize attributes
      client._location = location;
      client._port = port;
      client._id = id;

      // create the client and callbacks
      client._client = new Paho.MQTT.Client(client._location, Number(client._port), client._id);
      client._client.onConnectionLost = onConnectionLost;
      client._client.onMessageArrived = onMessageArrived;
    }

    function onMessageArrived(message) {
      //console.log("onMessageArrived:", message);

      //add new value to memory cache
      $rootScope.mqtt.subscribedTopics[message.destinationName] = [message.payloadString, Date.now()];

      $rootScope.$apply();

      let options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
   
      

      //give notification of new vlaue
      //FlashService.Success('<B>Topic:&nbsp;</B>' + message.destinationName + '<BR><B>Value:&nbsp;</B>' + message.payloadString + '<BR><B>Timestamp:&nbsp;</B>' + (new Date()).toLocaleString('en-us', options), 'MQTT Connection : New Message');
    }

    function send(message) {
      _call(_send, [message]);
    }

    function _send(message) {
      client._client.send(message);
    }

    function startTrace() {
      _call(_startTrace);
    }

    function _startTrace() {
      client._client.startTrace();
    }

    function stopTrace() {
      _call(_stopTrace);
    }

    function _stopTrace() {
      client._client.stopTrace();
    }

    function subscribe(filter, options) {
      _call(_subscribe, [filter, options]);
    }

    function _subscribe(filter, options) {
      client._client.subscribe(filter, options);
    }

    function unsubscribe(filter, options) {
      _call(_unsubscribe, [filter, options]);
    }

    function _unsubscribe(filter, options) {
      client._client.unsubscribe(filter, options);
    }

  }
})();
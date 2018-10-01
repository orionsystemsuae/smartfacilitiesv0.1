var config = require('config.json');
var express = require('express');
var router = express.Router();
var clientService = require('services/client.service');
var request = require('request');
// routes
router.get('/', getAll);
router.get('/:_id', getById);
router.post('/', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function getAll(req, res) {
    clientService.getAll()
        .then(function (clients) {
            if (clients) {
                res.send(clients);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    var clientId = req.params._id;
    clientService.getById(clientId)
        .then(function (client) {
            if (client) {
                res.send(client);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    clientService.create(req.body)
        .then(function (client) {
            createMqttCloudBrokerUser(client.mqttClientId);
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createMqttCloudBrokerUser(id) {
    var url = "https://" + config.mqttBrokerUserUrl;
    var auth = "Basic " + new Buffer(":" + config.mqttBrokerApiKey).toString("base64");
    request(
        {
            url: url,
            headers: {
                "Authorization": auth,
            },
            method: 'POST',
            form: { username: id, password: id }
        },
        function (error, response, result) {
            if (error) {
                console.log(error);
                //error send status back
                console.log('false');
                return false;
            }

            //success send status back  
            console.log(error);
            console.log(result);
            console.log('mqtt cloud user created');
            createMqttCloudBrokerAclRule(id, true, true);
            return true;
        }
    );
}

function createMqttCloudBrokerAclRule(id, readAllow, writeAllow) {
    var pattern = id + '/#';
    var auth = "Basic " + new Buffer(":" + config.mqttBrokerApiKey).toString("base64");
    var url = "https://" + config.mqttBrokerAclRuleUrl;
    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            },
            method: 'POST',
            form: { type: 'topic', username: id, pattern: pattern, read: readAllow, write: writeAllow }
        },
        function (error, response, result) {
            if (error) { console.log(error); console.log('false'); return false; }
            //success send result and status back
            console.log('mqqt cloud acl rule created');
            return true;
        }
    );
}

function deleteMqttCloudBrokerUser(username) {
    var url = "https://" + config.mqttBrokerUserUrl + '/' + username;
    var auth = "Basic " + new Buffer(":" + config.mqttBrokerApiKey).toString("base64");
    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            },
            method: 'DELETE'
        },
        function (error, response, result) {
            console.log(url);
            console.log(auth);
            if (error) { console.log(error); console.log('false'); return false; }
            //success send result and status back
            console.log('mqtt cloud user deleted');
            return true;
        }
    );
}

function update(req, res) {
    var loggedInUserId = req.user.sub;
    //if (req.params._id !== userId) {
    // can only update own account
    //    return res.status(401).send('You can only update your own account');
    //}
    var clientId = req.params._id;
    clientService.update(clientId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    var loggedInUserId = req.user.sub;
    //var userId = req.user.sub;
    //if (req.params._id !== userId) {
    // can only delete own account
    //    return res.status(401).send('You can only delete your own account');
    //}
    var clientId = req.params._id;

    //retrive client to get mqtt clientid
    clientService.getById(clientId)
        .then(function (client) {
            if (client) {
                //delete from cloud mqtt
                deleteMqttCloudBrokerUser(client[0].mqttClientId);

                //delete from database
                clientService.delete(clientId)
                    .then(function () {
                        res.sendStatus(200);
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });

            }
            else {
                console.log('Client not found.');
                res.sendStatus(200);
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send(err);
        });
}
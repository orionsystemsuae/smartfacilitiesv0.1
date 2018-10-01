var express = require('express');
var router = express.Router();
var metricService = require('services/metrics.service');
var request = require('request');
var config = require('config.json');
var auth = "Basic " + new Buffer(":" + config.mqttBrokerApiKey).toString("base64");

// routes
router.get('/mqtt/users/', getAllUsers);
router.get('/mqtt/users/:_id', getUser);
router.post('/mqtt/users/', createUser);
router.delete('/mqtt/users/:_id', deleteUser);
router.post('/mqtt/acls/', createAclRule);

// routes2
router.get('/series/', getSeries);


module.exports = router;

function getAllUsers(req, res) {
    var url = "https://" + config.mqttBrokerUserUrl;
    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            },
            method: 'GET'
        },
        function (error, response, result) {
            if (error)
                res.status(400).send(error);

            //success send result and status back
            res.status(200).send(result);
        }
    );
}

function getUser(req, res) {
    var url = "https://" + config.mqttBrokerUserUrl + '/' + req.params._id;
    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            },
            method: 'GET'
        },
        function (error, response, result) {
            if (error)
                res.status(400).send(error);

            //success send result and status back
            res.status(200).send(result);
        }
    );
}

function createUser(req, res) {
    var url = "https://" + config.mqttBrokerUserUrl;
    request(
        {
            url: url,
            headers: {
                "Authorization": auth,
            },
            method: 'POST',
            form: { username: req.body._id, password: req.body.password }
        },
        function (error, response, result) {
            if (error)
                res.status(400).send(error);

            //success send result and status back
            res.status(200).send(result);
        }
    );
}

function deleteUser(req, res) {
    var url = "https://" + config.mqttBrokerUserUrl + '/' + req.params._id;
    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            },
            method: 'DELETE'
        },
        function (error, response, result) {
            if (error)
                res.status(400).send(error);

            //success send result and status back
            res.status(200).send(result);
        }
    );
}

function createAclRule(req, res) {
    var type = "topic";
    var username = req.body._id;
    var pattern = req.body.pattern + '/#';
    var readAllow = req.body.readAllow;
    var writeAllow = req.body.writeAllow;;
    var auth = "Basic " + new Buffer(":" + config.mqttBrokerApiKey).toString("base64");
    var url = "https://" + config.mqttBrokerUserUrl;
    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            },
            method: 'POST'
        },
        function (error, response, result) {
            if (error)
                res.status(400).send(error);
            res.status(200).send(result);
        }
    );
}

function getSeries(req, res) {
    metricService.getSeries(req.query)
        .then(function (series) {
            if (series) {
                res.send(series);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
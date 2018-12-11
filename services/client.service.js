var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var generator = require('generate-password');
var Q = require('q');
var ObjectId = require('mongodb').ObjectID;
var shortid = require('shortid');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('clients');


var service = {};

service.getById = getById;
service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

// function getById2(_id) {
//     var deferred = Q.defer();
//     db.clients.findById(_id, function (err, client) {
//         if (err) deferred.reject(err.name + ': ' + err.message);

//         if (client) {
//             // return client (without hashed password)
//             deferred.resolve(_.omit(client, 'hash'));
//         } else {
//             // client not found
//             deferred.resolve();
//         }
//     });

//     return deferred.promise;
// }

function getById(_id) {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.clients.aggregate([
        { $match: { _id: ObjectId(_id) } },
        {
            $lookup:
            {
                from: "sites",
                localField: "_id",
                foreignField: "organisationId",
                as: "sites"
            }
        }
    ], function (err, clients) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (clients) {
            deferred.resolve(clients);
        } else {
            // client not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.clients.aggregate([{
        $lookup:
        {
            from: "sites",
            localField: "_id",
            foreignField: "organisationId",
            as: "sites"
        }
    }], function (err, clients) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (clients) {
            deferred.resolve(clients);
        } else {
            // client not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(clientParam) {
    var deferred = Q.defer();
    // validation
    db.clients.findOne(
        { abbrv: clientParam.abbrv },
        function (err, client) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (client) {
                // client abbrivation already exists
                deferred.reject('Client abbrivation"' + clientParam.abbrv + '" is already taken.');
            } else {
                createClient();
            }
        });

    function createClient() {
        // set client object to clientParam without the cleartext password
        var client = {};
        client.name = clientParam.name;
        client.label = clientParam.name;
        client.sites = [];
        client.createdOn = moment.utc().format();
        client.createdBy = client.createdBy ? client.createdBy : 'System';
        client.lastModifiedOn = moment.utc().format();
        client.lastModifiedBy = client.lastModifiedBy ? client.lastModifiedBy : 'System';
        client.abbrv = clientParam.abbrv;
        client.status = clientParam.status;
        client.description = clientParam.description;
        client.logo = clientParam.logo;
        client.servicePackage = clientParam.servicePackage;
        client.mqttClientId = clientParam.abbrv + '_' +shortid.generate();
        client.mqttServerUrl = 'm11.cloudmqtt.com';

        db.clients.insert(
            client,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(client);
            });
    }

    return deferred.promise;
}

function update(_id, clientParam) {
    var deferred = Q.defer();

    // validation
    db.clients.findById(_id, function (err, client) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (client.abbrv !== clientParam.abbrv) {

            // abbrv has changed so check if the new abbrv is already taken
            db.clients.findOne(
                { abbrv: clientParam.abbrv },
                function (err, client) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (client) {
                        // abbrv already exists
                        deferred.reject('Client abbrivation "' + clientParam.abbrv + '" is already taken')
                    } else {
                        updateClient();
                    }
                });
        } else {
            updateClient();
        }
    });

    function updateClient() {
        // fields to update
        var set = {
            name: clientParam.name,
            label: clientParam.name,
            abbrv: clientParam.abbrv,
            status: clientParam.status,
            description: clientParam.description,
            sites: clientParam.sites,
            status: clientParam.status,
            lastModifiedOn: moment.utc().format(),
            lastModifiedBy: clientParam.lastModifiedBy ? clientParam.lastModifiedBy : 'System',
            logo: clientParam.logo
        };

        db.clients.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.clients.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
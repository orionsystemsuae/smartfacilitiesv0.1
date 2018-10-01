var config = require('config.json');
var _ = require('lodash');
var moment = require('moment');
var Q = require('q');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('visualboards');


var service = {};

service.getById = getById;
service.getAll = getAll;
service.getByUserId = getByUserId;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();
    db.visualboards.findById(_id, function (err, visualboard) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (visualboard) {
            // return visualboard
            deferred.resolve(visualboard);
        } else {
            // visualboard not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.visualboards.find({}).toArray(function (err, visualboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (visualboards) {
            deferred.resolve(visualboards);
        } else {
            // visualboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getByOrganisationId(organisationId) {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.visualboards.find({ organisationId: ObjectId(organisationId) }).toArray(function (err, visualboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (visualboards) {
            deferred.resolve(visualboards);
        } else {
            // visualboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getByOrganisationId(organisationId) {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.visualboards.find({ organisationId: ObjectId(organisationId) }).toArray(function (err, visualboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (visualboards) {
            deferred.resolve(visualboards);
        } else {
            // visualboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getBySiteId(siteId) {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.visualboards.find({ siteId: ObjectId(siteId) }).toArray(function (err, visualboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (visualboards) {
            deferred.resolve(visualboards);
        } else {
            // visualboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getByUserId(userId, type) {
    var deferred = Q.defer();
    console.log(userId); console.log(type);

    // get visualboards by user id and visualboard type (private / shared)
    db.visualboards.find({ createdBy: ObjectId(userId), type: type }).toArray(function (err, visualboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (visualboards) {
            deferred.resolve(visualboards);
        } else {
            // visualboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(newVisualboard) {
    var deferred = Q.defer();
    // validation
    db.visualboards.findOne(
        {
            name: newVisualboard.name,
            createdBy: ObjectId(newVisualboard.createdBy)
        },
        function (err, visualboard) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (visualboard) {
                // client abbrivation already exists
                deferred.reject('Visualboard name "' + newVisualboard.name + '" is already taken.');
            } else {
                createVisualboard(newVisualboard);
            }
        });

    function createVisualboard(newVisualboard) {
        // set visualboard object to newVisualboard
        newVisualboard.label = newVisualboard.name;
        newVisualboard.type = 'private';
        newVisualboard.organisationId = ObjectId(newVisualboard.organisationId);
        newVisualboard.createdBy = ObjectId(newVisualboard.createdBy);
        newVisualboard.createdOn = moment.utc().format();
        newVisualboard.lastModifiedOn = moment.utc().format();
        newVisualboard.status = true;
        db.visualboards.insert(
            newVisualboard,
            function (err, doc) {
                if (err) 
                    deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(doc.ops[0]);
            });
    }
    return deferred.promise;
}

function update(_id, updatedVisualboard) {
    var deferred = Q.defer();

    // validation
    db.visualboards.findById(_id, function (err, visualboard) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (visualboard.name !== updatedVisualboard.name) {
            // name has changed so check if the new name is already taken
            db.visualboards.findOne(
                {
                    name: updatedVisualboard.name,
                    createdBy: ObjectId(updatedVisualboard.createdBy)
                },
                function (err, visualboard) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (visualboard) {
                        // name already exists
                        deferred.reject('Visualboard name "' + visualboard.name + '" is already taken.')
                    } else {
                        updateVisualboard(updatedVisualboard);
                    }
                });
        } else {
            updateVisualboard(updatedVisualboard);
        }
    });

    function updateVisualboard(updatedVisualboard) {
        // fields to update
        delete updatedVisualboard._id;
        updatedVisualboard.lastModifiedOn = moment.utc().format();
        updatedVisualboard.organisationId = ObjectId(updatedVisualboard.organisationId);
        updatedVisualboard.createdBy = ObjectId(updatedVisualboard.createdBy);

        db.visualboards.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: updatedVisualboard },
            function (err, doc) {
                if (err)
                    deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.visualboards.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
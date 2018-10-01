var config = require('config.json');
var _ = require('lodash');
var moment = require('moment');
var Q = require('q');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('dashboards');


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
    db.dashboards.findById(_id, function (err, dashboard) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (dashboard) {
            // return dashboard
            deferred.resolve(dashboard);
        } else {
            // dashboard not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.dashboards.find({}).toArray(function(err, dashboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (dashboards) {
           deferred.resolve(dashboards);
        } else {
            // dashboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getByOrganisationId(organisationId) {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.dashboards.find({organisationId : ObjectId(organisationId)}).toArray(function(err, dashboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (dashboards) {
           deferred.resolve(dashboards);
        } else {
            // dashboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getByOrganisationId(organisationId) {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.dashboards.find({organisationId : ObjectId(organisationId)}).toArray(function(err, dashboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (dashboards) {
           deferred.resolve(dashboards);
        } else {
            // dashboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getBySiteId(siteId) {
    var deferred = Q.defer();
    // get all clients (without hashed password)
    db.dashboards.find({siteId : ObjectId(siteId)}).toArray(function(err, dashboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (dashboards) {
           deferred.resolve(dashboards);
        } else {
            // dashboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getByUserId(userId, type) {
    var deferred = Q.defer();
    console.log(userId);    console.log(type);

    // get dashboards by user id and dashboard type (private / shared)
    db.dashboards.find({createdBy : ObjectId(userId), type : type}).toArray(function(err, dashboards) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (dashboards) {
           deferred.resolve(dashboards);
        } else {
            // dashboards not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(dashboardParam) {
    var deferred = Q.defer();
    // validation
    db.dashboards.findOne(
        { name: dashboardParam.name },
        function (err, dashboard) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (dashboard) {
                // client abbrivation already exists
                deferred.reject('Dashboard name "' + dashboardParam.name + '" is already taken.');
            } else {
                createDashboard();
            }
        });

    function createDashboard() {
        // set dashboard object to dashboardParam
        var dashboard = {};
        dashboard.name = dashboardParam.name;
        dashboard.label = dashboardParam.name;
        dashboard.description = dashboardParam.description;
        dashboard.homepage = dashboardParam.homepage;
        dashboard.organisationId = ObjectId(dashboardParam.organisationId);
        dashboard.createdBy = ObjectId(dashboardParam.createdBy);
        dashboard.createdOn = moment.utc().format();
        dashboard.lastModifiedOn = moment.utc().format();
        //dashboard.lastModifiedBy = dashboardParam.lastModifiedBy ? dashboardParam.lastModifiedBy : 'System';
        dashboard.status = true;
        dashboard.type = dashboardParam.type;
        dashboard.options = dashboardParam.options;
        dashboard.widgets = dashboardParam.widgets;
        db.dashboards.insert(
            dashboard,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }
    return deferred.promise;
}

function update(_id, dashboardParam) {
    var deferred = Q.defer();

    // validation
    db.dashboards.findById(_id, function (err, dashboard) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (dashboard.name !== dashboardParam.name) {
            // name has changed so check if the new name is already taken
            db.dashboards.findOne(
                { name: dashboardParam.name },
                function (err, dashboard) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (dashboard) {
                        // name already exists
                        deferred.reject('Dashboard name "' + clientParam.abbrv + '" is already taken.')
                    } else {
                        updateDashboard();
                    }
                });
        } else {
            updateDashboard();
        }
    });

    function updateDashboard() {
        // fields to update
        delete dashboardParam._id;
        dashboardParam.lastModifiedOn = moment.utc().format();
        dashboardParam.organisationId = ObjectId(dashboardParam.organisationId);
        dashboardParam.createdBy = ObjectId(dashboardParam.createdBy);

        db.dashboards.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: dashboardParam },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.dashboards.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
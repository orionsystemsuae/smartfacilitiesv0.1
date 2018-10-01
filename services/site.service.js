var config = require('config.json');
var _ = require('lodash');
var moment = require('moment');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('sites');


var service = {};

service.getById = getById;
service.getAllByClientId = getAllByClientId;
service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();
    db.sites.aggregate([{
        $lookup:
        {
            from: "clients",
            localField: "organisationId",
            foreignField: "_id",
            as: "organisation"
        }
    }, {
        $unwind: "$organisation"
    }, {
        $match: { "_id": mongo.helper.toObjectID(_id) }
    }], function (err, sites) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (sites) {
            deferred.resolve(sites[0]);
        } else {
            // site not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getAllByClientId(_id) {
    var deferred = Q.defer();
    db.sites.aggregate([{
        $lookup:
        {
            from: "clients",
            localField: "organisationId",
            foreignField: "_id",
            as: "organisation"
        }
    }, {
        $unwind: "$organisation"
    }, {
        $match: { "organisationId": mongo.helper.toObjectID(_id) }
    }], function (err, sites) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (sites) {
            deferred.resolve(sites);
        } else {
            // site not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    // get all sites (without hashed password)
    db.sites.aggregate([{
        $lookup:
        {
            from: "clients",
            localField: "organisationId",
            foreignField: "_id",
            as: "organisation"
        }
    }, {
        $unwind: "$organisation"
    }], function (err, sites) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (sites) {
            deferred.resolve(sites);
        } else {
            // site not found
            deferred.resolve();
        }
    });


    return deferred.promise;
}

function create(siteParam) {
    var deferred = Q.defer();
    // validation
    db.sites.findOne(
        { abbrv: siteParam.abbrv },
        function (err, site) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (site) {
                // site abbrivation already exists
                deferred.reject('Site abbrivation"' + siteParam.abbrv + '" is already taken.');
            } else {
                createSite();
            }
        });

    function createSite() {
        // set site object to siteParam without the cleartext password
        var site = {};
        site.name = siteParam.name;
        site.label = siteParam.name;
        site.createdOn = moment.utc().format();
        site.createdBy = site.createdBy ? site.createdBy : 'System';
        site.lastModifiedOn = moment.utc().format();
        site.lastModifiedBy = site.lastModifiedBy ? site.lastModifiedBy : 'System';
        site.abbrv = siteParam.abbrv;
        site.status = siteParam.status;
        site.description = siteParam.description;
        site.organisationId = mongo.helper.toObjectID(siteParam.organisationId);
        site.latitude = siteParam.latitude;
        site.longitude = siteParam.longitude;
        site.timeZone = siteParam.timeZone;
            site.children = [];

        db.sites.insert(
            site,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, siteParam) {
    var deferred = Q.defer();
    // validation
    db.sites.findById(_id, function (err, site) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (site.abbrv !== siteParam.abbrv) {
            // abbrv has changed so check if the new abbrv is already taken
            db.sites.findOne(
                { abbrv: siteParam.abbrv },
                function (err, site) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (site) {
                        // abbrv already exists
                        deferred.reject('Site abbrivation "' + siteParam.abbrv + '" is already taken')
                    } else {
                        updateSite();
                    }
                });
        } else {
            updateSite();
        }
    });

    function updateSite() {
        // fields to update
        var site = {
            name: siteParam.name,
            label: siteParam.label,
            abbrv: siteParam.abbrv,
            status: siteParam.status,
            description: siteParam.description,
            organisationId: mongo.helper.toObjectID(siteParam.organisationId),
            status: siteParam.status,
            latitude: siteParam.latitude,
            longitude: siteParam.longitude,
            timeZone: siteParam.timeZone,
            lastModifiedOn: moment.utc().format(),
            lastModifiedBy: siteParam.lastModifiedBy ? siteParam.lastModifiedBy : 'System',
            children: siteParam.children
        };

        db.sites.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: site },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.sites.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
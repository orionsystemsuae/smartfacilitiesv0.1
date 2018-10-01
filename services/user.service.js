var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var generator = require('generate-password');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');


var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.getAll = getAll;
service.getAllByClientId = getAllByClientId;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(email, password) {
    var deferred = Q.defer();
    db.users.findOne({ email: email }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    // db.users.findById(_id, function (err, user) {
    //     if (err) deferred.reject(err.name + ': ' + err.message);
    //     if (user) {
    //         //return user (without hashed password)
    //         deferred.resolve(_.omit(user, 'hash'));
    //     } else {
    //         // user not found
    //         deferred.resolve();
    //     }
    // });

    db.users.aggregate([{
        $lookup:
        {
            from: "clients",
            localField: "organisationId",
            foreignField: "_id",
            as: "organisation"
        }
    }, {
        $match: { "_id": mongo.helper.toObjectID(_id) }
    }], function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (users) {
            deferred.resolve(users[0]);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAllByClientId(_id) {
    var deferred = Q.defer();
    // get all users in the organisation (without hashed password)
    db.users.aggregate([{
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
    }], function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (users) {
            deferred.resolve(users);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    // get all users (without hashed password)
    db.users.aggregate([{
        $lookup:
        {
            from: "clients",
            localField: "organisationId",
            foreignField: "_id",
            as: "organisation"
        }
    }, {
        $unwind: "$organisation"
    }], function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (users) {
            deferred.resolve(users);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();
    // validation
    db.users.findOne(
        { email: userParam.email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // email already exists
                deferred.reject('Email "' + userParam.email + '" is already taken.');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
        user = _.omit(user, 'confirmPassword');
        user.createdOn = moment.utc().format();
        user.createdBy = user.createdBy ? user.createdBy : 'System';
        user.lastModifiedOn = moment.utc().format();
        user.organisationId = mongo.helper.toObjectID(user.organisationId);
        user.lastModifiedBy = user.lastModifiedBy ? user.lastModifiedBy : 'System';

        //generate random password
        var password = generator.generate({
            length: 10,
            numbers: true
        });

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password ? userParam.password : password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.email !== userParam.email) {
            // email has changed so check if the new email is already taken
            db.users.findOne(
                { email: userParam.email },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // email already exists
                        deferred.reject('Email "' + req.body.email + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            email: userParam.email,
            mobileNo: userParam.mobileNo,
            role: userParam.role,
            status: userParam.status,
            organisationId: mongo.helper.toObjectID(userParam.organisationId),
            profileImage: userParam.profileImage,
            lastModifiedOn: moment.utc().format(),
            lastModifiedBy: userParam.lastModifiedBy ? userParam.lastModifiedBy : 'System'

        };
        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
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

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
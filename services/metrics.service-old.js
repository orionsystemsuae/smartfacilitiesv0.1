var config = require('config.json');
var _ = require('lodash');
var moment = require('moment');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
const Influx = require('influxdb-nodejs');
const client = new Influx('https://haroon.rehman:Letmein100@pepsifree-4f1140ad.influxcloud.net:8086/' + 'DA');

const fieldSchema = {
    value: 'float',
};

const tagSchema = {
    org: '*',
    site: '*',
    topic: '*',
    type: ['reading', 'alarm', 'alarm-start', 'alarm-end', 'event', 'event-start', 'event-end'],
};




//db.bind('metrics');


var service = {};

service.insertData = insertData;


module.exports = service;

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function add_minutes(dt, minutes) {
    return new Date(dt.getTime() + minutes * 60000);
}
// Stats: Min, Max, mean / avg, Stdev
Array.prototype.min = function () {
    var array = this;
    return Math.min.apply(null, array.filter(value => value != null));
}

Array.prototype.max = function () {
    var array = this;
    return Math.max.apply(null, array);
}

Array.prototype.sum = function () {
    var array = this;
    return array.reduce(function (accumulator, currentValue) {
        return isNumeric(currentValue) ? accumulator + currentValue : accumulator;
    }, 0);
}

Array.prototype.count = function () {
    var array = this;
    return array.reduce(function (accumulator, currentValue) {
        return isNumeric(currentValue) ? accumulator + 1 : accumulator;
    }, 0);
}

Array.prototype.mean = function () {
    var array = this;
    var sum = 0;
    var n = 0;
    array.forEach(function (value) {
        sum += isNumeric(value) ? value : 0;
        if (isNumeric(value))
            n++;
    });
    return n > 0 ? sum / n : 0;
}

Array.prototype.stdev = function (data) {
    if (!data) {
        var data = this.data;
    }
    var sum = 0;
    var n = 0;
    var mean = this.mean();
    _.each(data, function (datapoint) {
        sum += (datapoint[1] - mean) * (datapoint[1] - mean);
        n++;
    });
    return Math.sqrt(sum / n);
}

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



function insertData(valueParam) {
    var deferred = Q.defer();
    // validation
    if (valueParam.name) {
        client.schema(valueParam.name, fieldSchema, tagSchema, {
            // default is false
            stripUnknown: false,
        });

        if (valueParam.timestamp) {
            //convert to date time
            var timestamp = new Date(valueParam.timestamp);
            //remove time, get date
            timestamp_day = new Date(timestamp.getFullYear(),
                timestamp.getMonth(),
                timestamp.getDate());

            if (valueParam.site) {
                if (valueParam.value) {

                    console.log("Writing data");
                    //wite data to influx db
                    client.write('event')
                        .tag({
                            org: valueParam.organisation,
                            site: valueParam.site,
                            topic: valueParam.name,
                            type: valueParam.type
                        })
                        .field({
                            value: valueParam.value
                        })
                        .time(new Date(valueParam.timestamp).valueOf(), 'ms')
                        .queue();

                    

                    client.syncWrite()
                        .then(() => deferred.resolve('sync write queue success'))
                        .catch(err => deferred.reject(`sync write queue fail, err:${err.message}`)
                    );

                    // db.collection('metrics_' + valueParam.site).findOne(
                    //     { name: valueParam.name, timestamp: timestamp_day },
                    //     function (err, day_doc) {
                    //         console.log(day_doc);

                    //         if (err) deferred.reject(err.tag + ': ' + err.message);

                    //         if (day_doc) {
                    //             // tag document for this date already exists
                    //             updateTagValue();
                    //         } else {
                    //             insertTagValue();
                    //         }
                    //     });
                }
                else
                    deferred.reject('Tag value not found.');
            }
            else
                deferred.reject('Site code not found.');
        }
        else
            deferred.reject('Timestamp not found.');
    }
    else
        deferred.reject('Tag name not found.');



    function insertTagValue() {
        var timestamp = new Date(valueParam.timestamp);
        var day_doc = {};
        day_doc.name = valueParam.name;
        day_doc.type = valueParam.type;
        day_doc.timestamp = new Date(timestamp.getFullYear(),
            timestamp.getMonth(),
            timestamp.getDate());
        day_doc.aggregates = {};
        day_doc.hours = [];
        day_doc.lastModifiedOn = new Date(moment.utc().format());
        //add 24 hours to day
        for (hr = 0; hr <= 23; hr++) {
            var hour_doc = {};
            hour_doc.timestamp = add_minutes(day_doc.timestamp, hr * 60);
            hour_doc.aggregates = {};
            hour_doc.minutes = [];
            //add sixty minutes to each hour
            for (min = 0; min <= 59; min++) {
                var minute_doc = {};
                minute_doc.timestamp = add_minutes(hour_doc.timestamp, min);
                minute_doc.aggregates = {};
                minute_doc.seconds = {
                    "0": null, "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null, "8": null, "9": null,
                    "10": null, "11": null, "12": null, "13": null, "14": null, "15": null, "16": null, "17": null, "18": null, "19": null,
                    "20": null, "21": null, "22": null, "23": null, "24": null, "25": null, "26": null, "27": null, "28": null, "29": null,
                    "30": null, "31": null, "32": null, "33": null, "34": null, "35": null, "36": null, "37": null, "38": null, "39": null,
                    "40": null, "41": null, "42": null, "43": null, "44": null, "45": null, "46": null, "47": null, "48": null, "49": null,
                    "50": null, "51": null, "52": null, "53": null, "54": null, "55": null, "56": null, "57": null, "58": null, "59": null
                };
                hour_doc.minutes.push(minute_doc);
            }
            day_doc.hours.push(hour_doc);
        }

        //set new value and calculate aggregated values
        if (isNumeric(valueParam.value)) {

            //set value
            day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].seconds[timestamp.getSeconds()] = parseFloat(valueParam.value);
            //set min level aggregates
            day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.min = parseFloat(valueParam.value);
            day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.max = parseFloat(valueParam.value);
            day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.sum = parseFloat(valueParam.value);
            day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.avg = parseFloat(valueParam.value);
            day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.count = 1;
            //set hr level aggregates
            day_doc.hours[timestamp.getHours()].aggregates.min = parseFloat(valueParam.value);
            day_doc.hours[timestamp.getHours()].aggregates.max = parseFloat(valueParam.value);
            day_doc.hours[timestamp.getHours()].aggregates.sum = parseFloat(valueParam.value);
            day_doc.hours[timestamp.getHours()].aggregates.avg = parseFloat(valueParam.value);
            day_doc.hours[timestamp.getHours()].aggregates.count = 1;
            //set day level aggregates
            day_doc.aggregates.min = parseFloat(valueParam.value);
            day_doc.aggregates.max = parseFloat(valueParam.value);
            day_doc.aggregates.sum = parseFloat(valueParam.value);
            day_doc.aggregates.avg = parseFloat(valueParam.value);
            day_doc.aggregates.count = 1;
        }
        else
            day_doc.hours[timestamp.getHours()].minutes[timestamp.getHours()].seconds[timestamp.getSeconds()] = valueParam.value;

        //insert raw and aggregated values
        db.collection('metrics_' + valueParam.site).insert(
            day_doc,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }

    function updateTagValue() {
        //convert to date time
        var timestamp = new Date(valueParam.timestamp);
        //remove hours, minutes, seconds
        var timestamp_day = new Date(timestamp.getFullYear(),
            timestamp.getMonth(),
            timestamp.getDate());

        //insert new value
        var newValue = {}

        if (isNumeric(valueParam.value))
            newValue["seconds." + timestamp.getSeconds()] = parseFloat(valueParam.value);
        else
            newValue["seconds." + timestamp.getSeconds()] = valueParam.value;

        //updated new value
        db.collection('metrics_' + valueParam.site).findOne(
            { name: valueParam.name, timestamp: timestamp_day },
            function (err, day_doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                //set new value and calculate aggregated values
                if (isNumeric(valueParam.value)) {

                    //set value
                    day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].seconds[timestamp.getSeconds()] = parseFloat(valueParam.value);

                    //set min level aggregates
                    var seconds_value_array = Object.keys(day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].seconds).map(function (k) { return day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].seconds[k] });
                    day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.count = seconds_value_array.count();
                    //if any numeric value found
                    if (day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.count > 0) {
                        day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.max = seconds_value_array.max();
                        day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.min = seconds_value_array.min();
                        day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.sum = seconds_value_array.sum();
                        day_doc.hours[timestamp.getHours()].minutes[timestamp.getMinutes()].aggregates.avg = seconds_value_array.mean();
                    }

                    //set hr level aggregates
                    day_doc.hours[timestamp.getHours()].aggregates.sum = 0;
                    day_doc.hours[timestamp.getHours()].aggregates.count = 0;
                    day_doc.hours[timestamp.getHours()].aggregates.avg = 0;
                    for (i = 0; i <= 59; i++) {
                        if (day_doc.hours[timestamp.getHours()].minutes[i].aggregates.min < day_doc.hours[timestamp.getHours()].aggregates.min)
                            day_doc.hours[timestamp.getHours()].aggregates.min = day_doc.hours[timestamp.getHours()].minutes[i].aggregates.min;

                        if (day_doc.hours[timestamp.getHours()].minutes[i].aggregates.max > day_doc.hours[timestamp.getHours()].aggregates.max)
                            day_doc.hours[timestamp.getHours()].aggregates.max = day_doc.hours[timestamp.getHours()].minutes[i].aggregates.max;
                        if (isNumeric(day_doc.hours[timestamp.getHours()].minutes[i].aggregates.sum))
                            day_doc.hours[timestamp.getHours()].aggregates.sum = day_doc.hours[timestamp.getHours()].aggregates.sum + day_doc.hours[timestamp.getHours()].minutes[i].aggregates.sum;
                        if (isNumeric(day_doc.hours[timestamp.getHours()].minutes[i].aggregates.count))
                            day_doc.hours[timestamp.getHours()].aggregates.count += day_doc.hours[timestamp.getHours()].minutes[i].aggregates.count;
                        if (day_doc.hours[timestamp.getHours()].aggregates.count > 0)
                            day_doc.hours[timestamp.getHours()].aggregates.avg = day_doc.hours[timestamp.getHours()].aggregates.sum / day_doc.hours[timestamp.getHours()].aggregates.count;
                    }

                    //set day level aggregates
                    day_doc.aggregates.sum = 0;
                    day_doc.aggregates.count = 0;
                    day_doc.aggregates.avg = 0;
                    for (i = 0; i <= 23; i++) {
                        if (day_doc.hours[i].aggregates.min < day_doc.aggregates.min)
                            day_doc.aggregates.min = day_doc.hours[i].aggregates.min;

                        if (day_doc.hours[i].aggregates.max < day_doc.aggregates.max)
                            day_doc.aggregates.max = day_doc.hours[i].aggregates.max;

                        if (isNumeric(day_doc.hours[i].aggregates.sum))
                            day_doc.aggregates.sum = day_doc.aggregates.sum + day_doc.hours[i].aggregates.sum;

                        if (isNumeric(day_doc.hours[i].aggregates.count))
                            day_doc.aggregates.count += day_doc.hours[i].aggregates.count;

                        if (day_doc.hours[i].aggregates.count > 0)
                            day_doc.aggregates.avg = day_doc.aggregates.sum / day_doc.aggregates.count;
                    }
                }
                else
                    day_doc.hours[timestamp.getHours()].minutes[timestamp.getHours()].seconds[timestamp.getSeconds()] = valueParam.value;

                //updated document
                db.collection('metrics_' + valueParam.site).update(
                    { name: valueParam.name, timestamp: timestamp_day },
                    { $set: day_doc },
                    function (err, result) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve(day_doc);
                    }
                );
            });
    }

    function insertTagValue2() {
        var timestamp = new Date(valueParam.timestamp);
        var minute_doc = {};
        minute_doc.name = valueParam.name;
        minute_doc.type = valueParam.type;
        minute_doc.timestamp_minute =
            new Date(timestamp.getFullYear(),
                timestamp.getMonth(),
                timestamp.getDate(),
                timestamp.getHours(),
                timestamp.getMinutes());
        minute_doc.lastModifiedOn = new Date(moment.utc().format());
        minute_doc.calcs = {};
        minute_doc.seconds = {
            "0": null, "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null, "8": null, "9": null,
            "10": null, "11": null, "12": null, "13": null, "14": null, "15": null, "16": null, "17": null, "18": null, "19": null,
            "20": null, "21": null, "22": null, "23": null, "24": null, "25": null, "26": null, "27": null, "28": null, "29": null,
            "30": null, "31": null, "32": null, "33": null, "34": null, "35": null, "36": null, "37": null, "38": null, "39": null,
            "40": null, "41": null, "42": null, "43": null, "44": null, "45": null, "46": null, "47": null, "48": null, "49": null,
            "50": null, "51": null, "52": null, "53": null, "54": null, "55": null, "56": null, "57": null, "58": null, "59": null
        };

        //calculate aggregated values
        if (isNumeric(valueParam.value)) {
            minute_doc.seconds[timestamp.getSeconds()] = parseFloat(valueParam.value);
            minute_doc.calcs.min = parseFloat(valueParam.value);
            minute_doc.calcs.max = parseFloat(valueParam.value);
            minute_doc.calcs.sum = parseFloat(valueParam.value);
            minute_doc.calcs.avg = parseFloat(valueParam.value);
            minute_doc.calcs.count = 1;
        }
        else
            minute_doc.seconds[timestamp.getSeconds()] = valueParam.value;

        //insert raw and aggregated values
        db.collection('metrics_' + valueParam.site).insert(
            minute_doc,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }

    function updateTagValue2() {
        //convert to date time
        var timestamp_minute = new Date(valueParam.timestamp);
        //remove seconds
        timestamp_minute = new Date(timestamp_minute.getFullYear(),
            timestamp_minute.getMonth(),
            timestamp_minute.getDate(),
            timestamp_minute.getHours(),
            timestamp_minute.getMinutes());

        //insert new value
        var newValue = {}
        newValue.lastModifiedOn = moment.utc().format();

        if (isNumeric(valueParam.value))
            newValue["seconds." + (new Date(valueParam.timestamp)).getSeconds()] = parseFloat(valueParam.value);
        else
            newValue["seconds." + (new Date(valueParam.timestamp)).getSeconds()] = valueParam.value;

        //updated new value
        db.collection('metrics_' + valueParam.site).findOneAndUpdate(
            { name: valueParam.name, timestamp_minute: timestamp_minute },
            { $set: newValue },
            { returnOriginal: false, upsert: true },
            function (err, minute_doc_updated) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                var seconds_value_array = Object.keys(minute_doc_updated.value.seconds).map(function (k) { return minute_doc_updated.value.seconds[k] });

                //calculate aggregated values 
                minute_doc_updated.value.calcs.count = seconds_value_array.count();

                //if any numeric value found
                if (minute_doc_updated.value.calcs.count > 0) {
                    minute_doc_updated.value.calcs.max = seconds_value_array.max();
                    minute_doc_updated.value.calcs.min = seconds_value_array.min();
                    minute_doc_updated.value.calcs.sum = seconds_value_array.sum();
                    minute_doc_updated.value.calcs.avg = seconds_value_array.mean();
                }

                //updated miniute level aggregated values
                db.collection('metrics_' + valueParam.site).update(
                    { name: valueParam.name, timestamp_minute: timestamp_minute },
                    { $set: minute_doc_updated.value },
                    function (err, result) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve();
                    }
                );
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
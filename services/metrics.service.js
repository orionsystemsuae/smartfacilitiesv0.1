var config = require('config.json');
var _ = require('lodash');
var moment = require('moment');
var Q = require('q');
const Influx = require('influxdb-nodejs');
const client = new Influx('https://haroon.rehman:Letmein100@pepsifree-4f1140ad.influxcloud.net:8086/' + 'DA_UN404VVVr');

var service = {};
service.getSeries = getSeries;
module.exports = service;

function getSeries(seriesParam) {
    var deferred = Q.defer();
    console.log('seriesParam', seriesParam);
    var queryStr = 'readings';
    switch (seriesParam.frequency) {
        case '1s': queryStr = 'readings'; break;
        case '1m': queryStr = 'readings_metrics_1m'; break;
        case '1h': queryStr = 'readings_metrics_1h'; break;
        case '1d': queryStr = 'readings_metrics_1d'; break;
        default: queryStr = 'readings'; break;
    }
    client.query(queryStr)
        .where('topic', seriesParam.topic.replace('DA_UN404VVVr/', ''))
        .where('time', seriesParam.timeStart, '>=')
        .where('time', seriesParam.timeEnd, '<=')
        .then(result => deferred.resolve(result)
        )
        .catch(error => deferred.reject(error));
    return deferred.promise;
}





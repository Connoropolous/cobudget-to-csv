require('dotenv').config();
var token = process.env.METAMAPS_TOKEN;
var async = require('async');
var mm = require('metamaps-client');
var CobudgetClient = require('cobudget-client');
var myClient = new CobudgetClient({ email: process.env.EMAIL, password: process.env.PASSWORD });

var map = {
  name: 'cobudget model map',
  desc: 'directly from your friendly neighbourhood cobudget',
  permission: 'private',
  arranged: true
};

var randomCoord = function () {
  var min = -1500, max = 1500;
  return Math.floor(Math.random() * (max - min)) + min;
};

myClient.init(function () {
  myClient.getItAll(function (err, results) {
    if (err || !results) return console.log('didn\'t work');
    async.waterfall([
      // create map
      async.apply(mm.createMap, map, token),
      // create topics
      function (map, callback) {
        var topicsToCreate = require('./processTopics.js')(results);
        var numCreated = 0;
        async.mapLimit(
           topicsToCreate,
           5, // max number of calls to make at once
           function (topic, cb) {
             console.log(numCreated + '/' + topicsToCreate.length);
             numCreated++;
             mm.addTopicToMap(token, map.id, randomCoord(), randomCoord(), topic, cb);
           },
           function (err, topics) {
             if (err) return callback(err);
             callback(null, topics, map);
           });
      },
      // create synapses
      function (topics, map, callback) {
        console.log('created topics');
        var synapsesToCreate = require('./processSynapses.js')(results, topics);
        async.mapSeries(
           synapsesToCreate,
           async.apply(mm.addSynapseToMap, token, map.id),
           function (err, synapses) {
             if (err) return callback(err);
             callback(null, topics, synapses, map);
           });
      }
    ], function (err, topics, synapses, map) {
      if (err) return console.log('everything broke: ' + err);
      console.log('created EVERYTHING');
    });
  });
});

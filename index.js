require('dotenv').config();
var fs = require('fs');
var async = require('async');
var CobudgetClient = require('cobudget-client');
var myClient = new CobudgetClient({ email: process.env.EMAIL, password: process.env.PASSWORD });
var json2csv = require('json2csv');

myClient.init(function () {
  myClient.getItAll(function (err, results) {
    if (err || !results) return console.log('didn\'t work');

    var data = [];
    results.buckets.forEach(function (b) {
      data.push({
        name: b.name,
        creator: b.author_name,
        funded: b.status === 'funded',
        funded_at: b.funded_at,
        target: b.target,
        total_contributions: b.total_contributions,
        description: b.description,
        url: 'http://beta.cobudget.co/#/buckets/' + b.id
      });
    });

    var fields = [
      'name', 'creator', 'funded', 'funded_at', 'target', 'total_contributions', 'description', 'url'
    ];
    json2csv({ data: data, fields: fields }, function(err, csv) {
      if (err) console.log(err);
      
      fs.writeFile('cobudgetBuckets-' + Date.now() + '.csv', csv, function(err) {
        if (err) console.log(err);
        else console.log('file saved');
      });
    });
  });
});

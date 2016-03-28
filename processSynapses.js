function processSynapses(data, topics) {
  var synapses = [];
  var topicsObj = {};

  topics.forEach(function (topic) {
    topicsObj[topic.link] = topic;
  });

  data.buckets.forEach(function (bucket) {
    bucket.contributions.forEach(function (contrib) {
      var user = topicsObj['http://beta.cobudget.co/#/users/' + contrib.user_id];
      var bucket = topicsObj['http://beta.cobudget.co/#/buckets/' + contrib.bucket_id]; 
      if (user && bucket) {
        synapses.push({
          node1_id: user.id,
          node2_id: bucket.id,
          desc: 'contributed ' + contrib.amount + ' to',
          permission: 'private',
          category: 'from-to'
        });
      }
    });

    bucket.comments.forEach(function (comment) {
      var user = topicsObj['http://beta.cobudget.co/#/users/' + comment.user_id];
      var bucket = topicsObj['http://beta.cobudget.co/#/buckets/' + comment.bucket_id]; 
      if (user && bucket) {
        synapses.push({
          node1_id: user.id,
          node2_id: bucket.id,
          desc: 'commented on',
          permission: 'private',
          category: 'from-to'
        });
      } 
    });
  });

  return synapses;
}

module.exports = processSynapses;

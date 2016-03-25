function processTopics(data) {
  var topics = [];

  topics.push({
    name: data.group.name,
    desc: data.group.currency_code + ' ' + data.group.currency_symbol,
    link: 'https://beta.cobudget.co/#/groups/' + data.group.id,
    metacode_id: 638205575, // group
    permission: 'private'
  });

  data.buckets.forEach(function (bucket) {
    topics.push({
      name: bucket.name,
      desc: bucket.description,
      link: 'https://beta.cobudget.co/#/buckets/' + bucket.id,
      metacode_id: 991788158, // idea
      permission: 'private'
    });
  });

  data.users.forEach(function (user) {
    topics.push({
      name: user.name,
      desc: '',
      link: 'https://beta.cobudget.co/#/users/' + user.id,
      metacode_id: 125146708, // person
      permission: 'private'
    });
  });

  return topics;
}

module.exports = processTopics;

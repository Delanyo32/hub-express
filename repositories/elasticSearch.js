var elasticsearch = require('elasticsearch');
var connectionString = "https://paas:4e27c5de00687be795b7a9f60b546445@thorin-us-east-1.searchly.com";
var googleConnection  = "http://35.225.152.102:9200";

var client = new elasticsearch.Client({
    host: googleConnection
});


// client.ping({
//     requestTimeout: 5000,
// }, function(error) {
//     if (error) {
//         console.log(error)
//         console.error('elasticsearch cluster is down!');
//     } else {
//         console.log('All is well');
//     }
// });

module.exports = client
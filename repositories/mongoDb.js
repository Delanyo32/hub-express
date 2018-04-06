var mongo = require('mongodb-stitch')
var express = require('express');
var properties = require("../properties")
let appId = 'hub-rnabd';
let stitch = mongo.StitchClientFactory.create(appId);


stitch.then(client => {
    client.authenticate('apiKey', properties.mongoDB.key).then((data) => {
        console.log(client.authedId())
    })
})

module.exports = stitch
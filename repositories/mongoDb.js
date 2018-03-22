var mongo = require('mongodb-stitch')
var express = require('express');

let appId = 'hub-rnabd';
let stitch = mongo.StitchClientFactory.create(appId);

module.exports = stitch
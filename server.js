var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./src/config'),
    schedule = require('./src/schedule');

var app = express();

// Connect to mongodb
var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect(config.db.release, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

require('./src/config/express')(app);
require('./src/routes')(app);

//schedule handlers
//schedule.runSchedule();

exports = module.exports = app;
var fs = require('fs'),
    config = require('../config'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    sessions = require('express-session'),
    compression = require('compression'),
    serveStatic = require('serve-static'),
    connectMongo = require('connect-mongo')(sessions),
    methodOverride = require('method-override'),
    path = require('path'),
    cors = require('cors'),
    swig = require('swig'),
    morgan = require('morgan');

module.exports = function (app) {

    //Compress all requests
    app.use(compression());

    //Logging middleware
    var logPath = path.resolve(__dirname + './../../log');
    var accessLogStream = fs.createWriteStream(logPath + '/access.log', {flags: 'a'});
    var logger = morgan("combined", {stream: accessLogStream});
    app.use(logger);

    //BodyParser should be above MethodOverride
    //app.use(bodyParser.text());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(function (req, res, next) {
        res.set('X-Powered-By', 'Movies Rating');
        next();
    });

    //Set views path, Template engine and Default layout
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.use('/apps', serveStatic(path.resolve(__dirname + './../../views')));

    //CookieParser
    app.use(cookieParser());
    var TwoHours = 3600000 * 2;
    app.use(sessions({
        resave: false,
        saveUninitialized: true,
        secret: 'keyboard cat',
        cookie: {secure: true, maxAge: TwoHours},
        store: new connectMongo({
            url: config.db.release,
            collection: 'sessions'
        })
    }));

    //Enable All CORS Requests
    app.use(cors());


};
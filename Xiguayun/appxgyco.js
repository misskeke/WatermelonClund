var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errpc = require('./bin/errrsp.js');
var mongo = require('mongoose');

var passR=require('./bin/passR');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.req = req;
    res.locals.res = res;
    next();
});
var db = mongo.createConnection("mongodb://root@127.1.23.1:27017/websint",{user:"root",pass:passR.MongodbPass});
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
    var routes = require('./routes/xgyco')({mongo: mongo, db: db, passR: passR});
    app.use('/', routes);
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('内容不存在');
        err.status = "E_CONTENT_NOT_FIND";
        err.httpste = 404;
        next(err);
    });
    app.use(function (err, req, res, next) {
        if (!err.httpste) {
            err = new Error(err.message);
            err.status = "E_SERVER_ERROR";
            err.httpste = 500;
        }
        errpc(res, err, err.httpste);
    });
});

module.exports = app;

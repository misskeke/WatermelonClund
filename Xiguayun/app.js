var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errpc = require('./bin/errrsp.js');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.req = req;
    res.locals.res = res;
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('内容不存在');
    err.status = "E_CONTENT_NOT_FIND";
    err.httpste = 404;
    next(err);
});

// error handlers


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    if(!err.httpste){
        err = new Error("系统错误");
        err.status = "E_SERVER_ERROR";
        err.httpste = 500;
    }
    errpc(res, err, err.httpste);
});


module.exports = app;

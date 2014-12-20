var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errpc = require('./bin/errrsp.js');
var mongo = require('mongoose');
var concat = require('concat-stream');
var passR=require('./bin/passR');

var nodpath=path.join(__dirname);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(function(req, res, next){
    if(req.method=="POST"){
        if(req.is("application/x-www-form-urlencoded")){
            req.isParsedBody=true;
            bodyParser.urlencoded({ extended: false, limit: '1mb' })(req,res,next);
        }else{
            req.pipe(concat(function(data){
                req.body = data.toString();
                next();
            }));
        }
    }else{
        next();
    }
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.req = req;
    res.locals.res = res;
    next();
});
var db = mongo.createConnection("mongodb://root@localhost:27017/websint",{user:"root",pass:passR.MongodbPass});
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
    var routes = require('./routes/index')({mongo: mongo, db: db, passR: passR});
    app.use('/', routes);
    app.use(function (req, res, next) {
        var err = new Error('内容不存在');
        err.status = "E_CONTENT_NOT_FIND";
        err.httpste = 404;
        next(err);
    });
    app.use(function (err, req, res, next) {
        if (!err.httpste) {
            console.error(err.stack);
            err = new Error("系统错误");
            err.status = "E_SERVER_ERROR";
            err.httpste = 500;
        }
        errpc(res, err, err.httpste);
    });
});

module.exports = app;

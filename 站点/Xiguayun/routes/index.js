var express = require('express');
var dderr = require('../bin/errcache.js');
var cache = require('memory-cache');
var strlib = require('../bin/str.js');
strlib.init(cache);
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { res: res, title: "推吧", dTitle: true, SpecH1: "",
        tieAmount: 0 });
});

router.get('/login/:usr?', function (req, res) {
    dderr(function () {
        res.render('login', { res: res, title: "登录", usr: req.params.usr });
    }, res);
});


router.get('/register', function (req, res) {
    dderr(function () {
        res.render('register', { res: res, title: "注册" });
    }, res);
});
router.post('/register', function (req, res) {
    dderr(function () {
        var mbname=strlib.strsftrim(req.body.username);
        var mbemill=strlib.strsftrim(req.body.emill);
        var mbpasswd=strlib;
        if(mbname.length<6 || mbname.length>15){
            res.send({successed:false,errName:"用户名不符合格式要求。请勿包括ASCII控制字符等。"});
            return;
        }
        if(!mbemill.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)){
            res.send({successed:false,errName:"邮箱不正确"});
            return;
        }
        res.send({successed:false,errName:"用户名已存在"});
    }, res);
});

router.post('/login', function (req, res) {
    dderr(function () {
        res.end();
    }, res);
});
router.post('/register', function (req, res) {
    dderr(function () {
        res.end();
    }, res);
});

module.exports = router;

var express = require('express');
var dderr = require('../bin/errcache.js');
var cache = require('memory-cache');
var strlib = require('../bin/str.js');
var cacVsid = {};
var cy = require('crypto');
strlib.init(cache);
var router = express.Router();

function wisGen(req, res) {
    var wisZd = req.cookies.wis;

    function gencWiszd() {
        var wiRdn = cy.randomBytes(255).toString("hex");
        if (cacVsid[wiRdn]) {
            gencWiszd();
            return;
        }
        cacVsid[wiRdn] = cy.randomBytes(255).toString("hex");
        res.cookie("wis", wiRdn, {
            httpOnly: true, secure: true
        });
        wisZd = wiRdn;
    }

    if (wisZd) {
        if (!cacVsid[wisZd]) {
            gencWiszd();
        }
    } else {
        gencWiszd();
    }
    res.locals.wisChk = cacVsid[wisZd];
    return cacVsid[wisZd];
}
function wisChk(req, res) {
    var wisZd = req.cookies.wis;
    var wisChk = req.body.wisChk;
    var correct = cacVsid[wisZd];
    return (wisZd && wisChk && (correct == wisChk) && correct);
}
function wisNorq(req, res) {
    res.render('ccr', {title: "Oh", SpecH1: ""});
}
router.use(function (req, res, next) {
    wisGen(req, res);
    next();
});

router.get('/', function (req, res) {
    dderr(function () {
        res.render('index', { title: "推吧，让人们总能聚到一起", dTitle: true, SpecH1: "",
            tieAmount: 0 });
    }, res);
});
router.get('/ccr', function (req, res) {
    dderr(function () {
        wisNorq(req, res);
    }, res);
});
router.get('/ccr/test', function (req, res) {
    dderr(function () {
        res.render('ccrtest');
    }, res);
});
router.get('/ccr/:usr', function (req, res) {
    dderr(function () {
        res.redirect('/ccr');
    }, res);
});

router.get('/login/:usr?', function (req, res) {
    dderr(function () {
        res.render('login', { title: "登录", usr: req.params.usr });
    }, res);
});


router.get('/register', function (req, res) {
    dderr(function () {
        res.render('register', { title: "注册" });
    }, res);
});
router.get('/register/:usr', function (req, res) {
    dderr(function () {
        res.redirect('/register');
    }, res);
});
router.post('/register', function (req, res) {
    dderr(function () {
        if (!wisChk(req, res)) {
            return wisNorq(req, res)
        }
        var mbname = strlib.strsftrim(req.body.username);
        var mbemill = strlib.strsftrim(req.body.emill);
        var mbpasswd = strlib;
        if (mbname.length < 6 || mbname.length > 15) {
            res.send({successed: false, errName: "用户名不符合格式要求。请勿包括ASCII控制字符等。"});
            return;
        }
        if (!mbemill.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
            res.send({successed: false, errName: "邮箱不正确"});
            return;
        }
        res.send({successed: false, errName: "用户名已存在"});
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


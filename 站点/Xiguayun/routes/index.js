var express = require('express');
var dderr=require('../bin/errcache.js');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { res:res, title:"推吧", dTitle:true, SpecH1:"",
        tieAmount:0 });
});

router.get('/login/:usr?', function (req, res) {
    dderr(function(){
        res.render('login', { res:res, title:"登录",usr:req.params.usr });
    },res);
});
router.get('/register', function (req, res) {
    dderr(function(){
        res.render('register', { res:res, title:"注册" });
    },res);
});

module.exports = router;

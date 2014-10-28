var express = require('express');
var strlib = require('../bin/str.js');
var cacVsid = {};
var Memcached = require('memcached');
var cy = require('crypto');
var router = express.Router();
var marked = require('marked');
var dbc, mon;


marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true
});
marked.setOptions({
    highlight: function (code, lang, callback) {
        require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
            callback(err, (result ? result.toString() : ""));
        });
    }
});

router.get('/', function (req, res) {
    res.render('indexxgyco', { title: "短链接 | 推吧", dTitle: true, SpecH1: "" });
});
router.get('/short', function (req, res) {
    if (req.query.url && req.query.url.length > 0) {
        var url = req.query.url;
        var portal = url.match(/^([A-Za-z0-9]+):\/\//);
        if (portal) {
            portal = portal[1] || "http";
        } else {
            url = "http://" + url;
        }
        if (req.query.tiny) {
            if (req.query.tiny.match(/[\/\\\?#]/)) {
                res.send({error: "未知错误"});
            }
        }
        if (portal && portal != "http" && portal != "https") {
            res.send({error: "URL not valid"});
        } else {
            var shourlModel = dbc.model('shourl');
            shourlModel.find({tinyurl: req.query.tiny},function(e,s){
                if(e){s=[];}
                if(s.length>0){
                    res.send({error: "短链接已存在。",seOdl: true});
                }else{
                    shourlModel.find({fullurl: url}, function (e, s) {
                        if (e) {
                            s = []
                        }
                        if (s.length > 0 && (!req.query.tiny || req.query.tiny == s[s.length - 1].tinyurl)) {
                            res.send({tiny: s[0].tinyurl});
                        } else {
                            var urlEnt = new shourlModel({fullurl: url,
                                tinyurl: req.query.tiny || strlib.randomStr(5, 'abcdefhkmnopqtwxz'), appendip: req.ip, appenddate: new Date() });
                            urlEnt.save(function (err) {
                                if (err) {
                                    res.send({error: err.message});
                                } else {
                                    res.send({tiny: urlEnt.tinyurl});
                                }
                            });
                        }
                    });
                }
            });
        }
    } else {
        res.end();
    }
});

router.get('/:dl', function (req, res) {
    var ddc = req.params.dl;
    var shourlModel = dbc.model('shourl');
    shourlModel.find({tinyurl: ddc}, function (e, s) {
        if (e) {
            s = []
        }
        if(s.length > 0){
            if(isNaN(s[0].fwAcount)){
                s[0].set('fwAcount',0);
            }
            s[0].fwAcount++;
            s[0].save();
        }
        if (s.length > 1 || (req.query.norec == 1 && s.length > 0)) {
            res.render('xgycolist', { title: "短链接", tiny: ddc, count: s.length, s: s, succ: req.query.successful == 1, aco: s[0].fwAcount });
        } else if (s.length < 1) {
            res.render('xgyconotfind', { title: "url未找到", tiny: ddc });
        } else {
            res.redirect(s[0].fullurl);
        }

    });
});

module.exports = function (d) {
    mon = d.mongo;
    dbc = d.db;
    var memcached = new Memcached("localhost");
    var shourl = new mon.Schema({
        fullurl: String,
        tinyurl: String,
        appendip: String,
        appenddate: Date,
        appendby: String,
        fwAcount: {type: Number, default: 0}
    });
    var shourlModel = dbc.model('shourl', shourl);
    strlib.init(memcached);
    return router;
};


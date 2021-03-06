var express = require('express');
var strlib = require('../bin/str.js');
var cy = require('crypto');
var router = express.Router();
var marked = require('marked');
var ersp = require('../bin/errrsp.js');
var xadd;
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
router.get('/@ip', function(req, res){
    res.redirect('http://www.ip-tracker.org/locator/ip-lookup.php?ip='+req.ip);
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
                return;
            }
            if (req.query.tiny.charAt(0)=="@") {
                res.send({error: "未知错误"});
                return;
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

router.get('/@', function(req, res){
    var rf=strlib.strsftrim(req.query.u);
    if(rf && rf.match(/^http(s*):\/\/.+$/)){
        var shourlModel = dbc.model('shourl');
        shourlModel.find({fullurl: rf}, function (e, s) {
            if (e) {
                s = []
            }
            if (s.length > 0) {
                res.redirect("/"+s[0].tinyurl+"?norec=1&successful=1");
            } else {
                var urlEnt = new shourlModel({fullurl: rf,
                    tinyurl: strlib.randomStr(5, 'abcdefhkmnopqtwxz'), appendip: req.ip, appenddate: new Date() });
                urlEnt.save(function (err) {
                    if (err) {
                        res.send({error: err.message});
                    } else {
                       res.redirect("/"+urlEnt.tinyurl+"?norec=1&successful=1");
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
});

router.get('/:dl', function (req, res) {
    var ddc = req.params.dl;
    if(ddc.charAt(0)=="@"){
        return xadd.shoAtHandle(req,res);
    }
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
            res.status(404);
            res.render('xgyconotfind', { title: "url未找到", tiny: ddc });
        } else {
            res.redirect(s[0].fullurl);
        }

    });
});

router.post('/@md/preview', function (req, res) {
    var mdc = req.body.md;
    if (!mdc || mdc.trim().length < 1) {
        res.send({preview: "没什么可预览的."});
        return;
    }
    marked(mdc, function (err, content) {
        if (err) {
            res.send({preview: "错误.", error: err.message})
        } else {
            res.send({preview: content});
        }
    });
});

module.exports = function (d) {
    mon = d.mongo;
    dbc = d.db;
    var shourl = new mon.Schema({
        fullurl: String,
        tinyurl: String,
        appendip: String,
        appenddate: Date,
        appendby: String,
        fwAcount: {type: Number, default: 0}
    });
    var shourlModel = dbc.model('shourl', shourl);
    strlib.init();
    xadd=require('../bin/xAddon.js')(mon,dbc,strlib,ersp);
    return router;
};


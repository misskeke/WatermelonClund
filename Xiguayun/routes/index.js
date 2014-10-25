var express = require('express');
var strlib = require('../bin/str.js');
var smail = require('../bin/mail.js');
var cy = require('crypto');
var router = express.Router();
var Memcached = require('memcached');
var marked = require('marked');
var ccap = require('ccap');
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

function wisGen(req, res, cbc) {
    var wisZd = req.cookies.wis;
    var xgWisModel = dbc.model('xgWis');

    function genc(cbc) {
        var wi = new xgWisModel({wis: cy.randomBytes(255).toString("hex"), wisRq: cy.randomBytes(255).toString("hex"), session: {}});
        res.cookie("wis", wi.wis, {
            httpOnly: true, secure: true
        });
        wi.save(function () {
            cbc(wi.wis, wi.wisRq, wi);
        });
    }

    if (wisZd) {
        xgWisModel.find({wis: wisZd}, function (e, s) {
            if (e) {
                s = [];
            }
            if (s.length > 0) {
                cbc(wisZd, s[0].wisRq, s[0]);
            } else {
                genc(cbc);
            }
        });
    } else {
        genc(cbc);
    }
}

function wisChk(req, res, cbc) {
    var wisZd = req.cookies.wis;
    var wisChk = req.body.wisChk;
    var xgWisModel = dbc.model('xgWis');
    xgWisModel.find({wis: wisZd, wisRq: wisChk}, function (e, s) {
        if (e) {
            s = [];
        }
        if (s.length > 0) {
            cbc();
        } else {
            res.render('ccr', {title: "Oh", SpecH1: ""});
        }
    });
}

function markusedVcode(wi,cbc){
    delete wi.session.vcodeState;
    wi.markModified('session');
    wi.save(function (e) {
        cbc(e);
    });
}

router.use(function (req, res, next) {
    wisGen(req, res, function (wis, chk, wi) {
        res.locals.wisChk = chk;
        res.sessWi = wi;
        next();
    });
});

router.get('/', function (req, res) {
    res.render('index', { title: "推吧 - 帖子，微博", dTitle: true, SpecH1: "",
        tieAmount: 0 });
});
router.get('/ccr', function (req, res) {
    res.render('ccr', {title: "Oh", SpecH1: ""});
});
router.get('/ccr/test', function (req, res) {
    res.render('ccrtest');
});
router.get('/ccr/:usr', function (req, res) {
    res.redirect('/ccr');
});

router.get('/login/:usr?', function (req, res) {
    res.render('login', { title: "登录", usr: req.params.usr });
});

router.get('/register', function (req, res) {
    var wi = res.sessWi;
    if (res.sessWi.session.reg) {
        var xgRegTaskModel = dbc.model('xgRegTask');
        xgRegTaskModel.find({_id: wi.session.reg}, function (e, s) {
            if (e) {
                s = []
            }
            if (s.length > 0) {
                res.redirect('/register/clr');
            } else {
                res.render('register', { title: "注册" });
            }
        });
    } else {
        res.render('register', { title: "注册" });
    }
});
router.get('/register/clr', function (req, res) {
    var wi = res.sessWi;
    if (res.sessWi.session.reg) {
        var xgRegTaskModel = dbc.model('xgRegTask');
        xgRegTaskModel.find({_id: wi.session.reg}, function (e, s) {
            if (e) {
                s = []
            }
            if (s.length > 0) {
                res.render('reging', { title: "欢迎！" + s[0].name, regTask: s[0] });
            } else {
                res.redirect('/register');
            }
        });
    } else {
        res.redirect('/register');
    }
});

router.get('/register/:usr', function (req, res) {
    res.redirect('/register');
});

router.post('/register', function (req, res) {
    wisChk(req, res, function () {
        var wi = res.sessWi;
        var mbname = strlib.strsftrim(req.body.username);
        var mbemill = strlib.strsftrim(req.body.emill);
        var mbpasswd = req.body.password;
        if (mbname.length < 3 || mbname.length > 15) {
            res.send({successed: false, errName: "用户名不符合格式要求。请勿包括ASCII控制字符等。"});
            return;
        }
        if (!mbemill.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
            res.send({successed: false, errName: "邮箱不正确"});
            return;
        }
        var xgUserModel = dbc.model('xgUser');
        xgUserModel.find({name: mbname}, "name", function (e, s) {
            if (e) {
                s = []
            }
            if (s.length > 0) {
                res.send({successed: false, errName: "用户名已存在"});
            } else {
                var xgRegTaskModel = dbc.model('xgRegTask');
                var ddcTask = new xgRegTaskModel({name: mbname, password: strlib.md5(mbpasswd), regIp: req.ip, regDate: new Date(),
                    email: mbemill });
                ddcTask.save(function (err) {
                    if (err) {
                        res.send({errName: err.message + "，请稍候重试。"});
                    } else {
                        wi.session.reg = ddcTask.id;
                        wi.markModified('session');
                        wi.save(function (e) {
                            if (e) {
                                res.send({errName: err.message + "，请稍候重试。"});
                            } else {
                                res.send({successful: true});
                            }
                        });
                    }
                });
            }
        });
    });
});

router.post("/register/undoTask", function (req, res) {
    wisChk(req, res, function () {
        var wi = res.sessWi;
        if (res.sessWi.session.reg) {
            var xgRegTaskModel = dbc.model('xgRegTask');
            xgRegTaskModel.find({_id: wi.session.reg}, function (e, s) {
                if (e) {
                    s = []
                }
                if (s.length > 0) {
                    xgRegTaskModel.remove({_id: wi.session.reg}, function (e, s) {
                        if (e) {
                            res.send({error: -2});
                        } else {
                            res.send({error: 0});
                        }
                    });
                } else {
                    res.send({error: -1});
                }
            });
        } else {
            res.send({error: -1});
        }
    });
});

router.post('/register/doConfirm',function(req,res){
    wisChk(req,res,function(){
        var wi = res.sessWi;
        if(wi.session.vcodeState && wi.session.vcodeState.text){
            if(req.body.vcode == wi.session.vcodeState.text){
                markusedVcode(wi,function(){
                    res.send({error:"OK"});
                });
            }else{
                res.send({error:"验证码错误"});
            }
        }else{
            res.send({error:"验证码已过期。请更换验证码。"});
        }
    });
});

router.post('/login', function (req, res) {
    res.end();
});
router.post('/register', function (req, res) {
    res.end();
});

router.get('/dev/mailView',function(req,res){
    smail("Hello World", "世界，您好！", "wtmtim@126.com", "王庭茂");
    res.render('mailT',{MailTitle:"Example Title 测试模板",tdlink:"/",content:"<b>默认内容</b>"});
});

router.get('/markdown/try', function (req, res) {
    res.render('mdtry', {title: "测试Markdown"});
});
router.get('/markdown/', function (req, res) {
    res.redirect('/markdown/try');
});
router.get('/markdown/:hel', function (req, res) {
    throw {message: "此提示不存在", httpste: 404, status: "MD_TIP_NOTFIND"};
});
router.post('/markdown/preview', function (req, res) {
    wisChk(req, res, function () {
        var mdc = req.body.md;
        if (!mdc || mdc.trim().length < 1) {
            res.send({preview: "Nothing."});
            return;
        }
        marked(mdc, function (err, content) {
            if (err) {
                res.send({preview: "With error.", error: err.message})
            } else {
                res.send({preview: content});
            }
        });
    });
});

router.get('/dev/fatchVcode', function (req, res) {
    res.set("Pragma","no-cache");
    res.set("Cache-Control","no-cache");
    var wi = res.sessWi;
    res.type('jpg');
    function genVcode() {
        var cap = ccap({
            width: 150,
            height: 40,
            offset: 0,
            quality: 100,
            fontsize: 24,
            generate: function () {
                return strlib.randomStr(4, '0123456789');
            }
        });
        return cap.get();
    }

    if (wi.session.vcodeState && wi.session.vcodeState.buff && wi.session.vcodeState.text) {
        res.send(wi.session.vcodeState.buff.read(0));
    } else {
        var gc = genVcode();
        wi.session.vcodeState = {buff: gc[1], text: gc[0]};
        wi.markModified("session");
        wi.save(function () {
            res.send(wi.session.vcodeState.buff);
        });
    }
});
router.post('/dev/fatchVcode/new', function (req, res) {
    wisChk(req, res, function () {
        var wi = res.sessWi;
        delete wi.session.vcodeState;
        wi.markModified('session');
        wi.save(function (e) {
            if (e) {
                res.send({error: -1})
            } else {
                res.send({error: 0})
            }
        });
    });
});

module.exports = function (d) {
    mon = d.mongo;
    dbc = d.db;
    var memcached = new Memcached("localhost");
    strlib.init(memcached);
    var uLog = new mon.Schema({
        date: Date,
        ip: String,
        action: String,
        uA: String,
        value: {}
    });
    var uHeadPic = new mon.Schema({
        date: Date,
        ip: String,
        picid: String,
        text: String,
        size: [Number, Number]
    });
    var xgUser = new mon.Schema({
        name: String,
        password: String,
        regIp: String,
        regDate: Date,
        lastIp: String,
        log: [uLog],
        email: String,
        headPics: [uHeadPic]
    });
    var xgRegTask = new mon.Schema({
        name: String,
        password: String,
        regIp: String,
        regDate: Date,
        email: String,
        confired: { type: Boolean, default: false },
        userCreated: { type: Boolean, default: false }
    });
    var xgWis = new mon.Schema({
        wis: String,
        wisRq: String,
        session: {type: {}, default: {}}
    });
    var xgUserModel = dbc.model('xgUser', xgUser);
    var xgRegTaskModel = dbc.model('xgRegTask', xgRegTask);
    var xgWisModel = dbc.model('xgWis', xgWis);
    return router;
};


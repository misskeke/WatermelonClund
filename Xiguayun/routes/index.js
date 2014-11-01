var express = require('express');
var strlib = require('../bin/str.js');
var smail;
var ersp = require('../bin/errrsp.js');
var cy = require('crypto');
var router = express.Router();
var Memcached = require('memcached');
var marked = require('marked');
var fs = require('fs');
var ccap = require('ccap');
var dbc, mon;
var conts={
    mdHelp: fs.readFileSync('../public/i/Mdhelp.md', 'utf8')
};

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
            httpOnly: true, secure: true, expires: new Date(Date.now() + 99999999999)
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

function markusedVcode(wi, cbc) {
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

router.use(function (req, res, next) {
    res.sessWi.username(function(un, isn){
        res.locals.lognUsn = un;
        res.locals.lognIsReg = isn;
        res.locals.dbdStyle= (un?"text-align: right;":"");
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
                if(s[0].confired){
                    res.redirect('/register/3');
                    return;
                }
                res.render('reging', { title: "欢迎！" + s[0].name, regTask: s[0] });
            } else {
                res.redirect('/register');
            }
        });
    } else {
        res.redirect('/register');
    }
});
router.get('/register/2', function (req, res) {
    var wi = res.sessWi;
    if (res.sessWi.session.reg) {
        var xgRegTaskModel = dbc.model('xgRegTask');
        xgRegTaskModel.find({_id: wi.session.reg}, function (e, s) {
            if (e) {
                s = []
            }
            if (s.length > 0) {
                if(s[0].confired){
                    res.redirect('/register/3');
                    return;
                }
                if (s[0].lastCode.length > 0) {
                    res.render('zcIptconf', { title: "输入邮箱验证码" });
                } else {
                    res.redirect("/register/clr");
                }
            } else {
                ersp(res, new Error("-"));
            }
        });
    } else {
        ersp(res, new Error("-"));
    }
});
router.get('/register/3', function (req, res) {
    var wi = res.sessWi;
    if (res.sessWi.session.reg) {
        var xgRegTaskModel = dbc.model('xgRegTask');
        xgRegTaskModel.find({_id: wi.session.reg}, function (e, s) {
            if (e) {
                s = []
            }
            if (s.length > 0) {
                if (s[0].confired) {
                    res.render('zcStun', { title: "最后事项", SpecH1: "", uud:true });
                } else {
                    res.redirect("/register/2");
                }
            } else {
                ersp(res, new Error("-"));
            }
        });
    } else {
        ersp(res, new Error("-"));
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
                xgRegTaskModel.find({name: mbname, confired: true},function(e,s){
                    if(e){s=[];}
                    if(s.length>0){
                        res.send({successed: false, errName: "用户名已存在"});
                        return;
                    }
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

router.post('/register/doConfirm', function (req, res) {
    wisChk(req, res, function () {
        var wi = res.sessWi;
        var xgRegTaskModel = dbc.model('xgRegTask');
        if(req.body.hasOwnProperty("code")){
            xgRegTaskModel.find({_id: wi.session.reg}, function (e, s) {
                if (e) {
                    s = []
                }
                if (s.length > 0) {
                    if(s[0].lastCode == req.body.code){
                        s[0].confired = true;
                        s[0].save(function(){
                            res.send({});
                        });
                    }else{
                        res.send({error: "……"});
                    }
                } else {
                    res.send({error: "内部错误，请重试。"});
                }
            });
        }else{
            if (wi.session.vcodeState && wi.session.vcodeState.text) {
                if (req.body.vcode == wi.session.vcodeState.text) {
                    markusedVcode(wi, function () {
                        xgRegTaskModel.find({_id: wi.session.reg}, function (e, s) {
                            if (e) {
                                s = []
                            }
                            if (s.length > 0) {
                                s[0].lastCode = strlib.randomStr(6, "0123456789");
                                smail("您的邮箱验证码", "您刚刚注册了本站帐号，您的邮箱验证码为：" +
                                    "<b style='color: deepskyblue; margin: 4px;'>" + s[0].lastCode + "</b>。" +
                                    "<br>如果您没有注册，请直接忽略本邮件。", s[0].email, s[0].name, undefined, wi, true);
                                s[0].save(function () {
                                    res.send({});
                                });
                            } else {
                                res.send({error: "内部错误，请重试。"});
                            }
                        });
                    });
                } else {
                    res.send({error: "验证码错误"});
                }
            } else {
                res.send({error: "验证码已过期。请更换验证码。"});
            }
        }
    });
});

router.post('/login', function (req, res) {
    res.end();
});
router.post('/register', function (req, res) {
    res.end();
});

router.get('/dev/mailView/:mdchk?', function (req, res) {
    var wi = res.sessWi;
    if (req.params.mdchk) {
        var xgMail = dbc.model('xgMil');
        xgMail.find({_id: req.params.mdchk}, function (e, s) {
            if (e) {
                s = [];
            }
            if (s.length < 1) {
                var ep = new Error("邮件不存在");
                ep.status = "ITEM_NOTFIND";
                ersp(res, ep, 404);
            } else {
                if (s[0].canShow(wi.username(), wi.wis)) {
                    res.render('mailT', {MailTitle: s[0].subject, content: s[0].content});
                } else {
                    var epa = new Error("拒绝访问");
                    epa.status = "ACCESS_DENIED";
                    ersp(res, epa, 401);
                }
            }
        });
    } else {
        res.render('mailT', {MailTitle: "Hi~", content: "Hello World."});
    }
});

router.get('/markdown/try', function (req, res) {
    res.render('mdtry', {title: "测试Markdown"});
});
router.get('/markdown/helptips', function (req, res) {
    res.render('markdownHelp', {title: "学习使用`Markdown`", mdc:conts.mdHelpmded});
});
router.get('/markdown/', function (req, res) {
    res.redirect('/markdown/try');
});
router.get('/markdown/helptipssrc', function (req, res) {
    res.redirect('/i/Mdhelp.md');
});
router.get('/markdown/:hel', function (req, res) {
    throw {message: "此提示不存在", httpste: 404, status: "MD_TIP_NOTFIND"};
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
router.post('/markdown/preview', function (req, res) {
    wisChk(req, res, function () {
        res.redirect("/@md/preview");
    });
});

router.get('/dev/fatchVcode', function (req, res) {
    res.set("Pragma", "no-cache");
    res.set("Cache-Control", "no-cache");
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
        lastCode: { type: String, default: "" },
        confired: { type: Boolean, default: false },
        userCreated: { type: Boolean, default: false }
    });
    var xgWis = new mon.Schema({
        wis: String,
        wisRq: String,
        session: {type: {}, default: {}}
    });
    xgWis.methods.username = function (callback) {
        if (this.session.reg) {
            var xgRegTaskModel = dbc.model('xgRegTask');
            xgRegTaskModel.find({_id: this.session.reg}, function (e, s) {
                if (e) {
                    s = []
                }
                if (s.length > 0) {
                    callback(s[0].name, true);
                }else{
                    callback("");
                }
            });
        }else{
            callback("");
        }
    };
    var xgMil = new mon.Schema({
        auth_user: {type: String, default: ""},
        auth_wis: String,
        subject: String,
        content: String,
        readFromWeb_can: {type: Boolean, default: true}
    });
    xgMil.methods.canShow = function (usr, wis) {
        return this.readFromWeb_can && ((usr == this.auth_user && this.auth_user != "") || (this.auth_user.length < 0 && this.auth_wis == wis));
    };
    var xgUserModel = dbc.model('xgUser', xgUser);
    var xgRegTaskModel = dbc.model('xgRegTask', xgRegTask);
    var xgWisModel = dbc.model('xgWis', xgWis);
    var xgMilModel = dbc.model('xgMil', xgMil);
    smail = require('../bin/mail.js')(dbc, mon);
    marked(conts.mdHelp, function (err, content) {
        conts.mdHelpmded=content;
    });
    return router;
};


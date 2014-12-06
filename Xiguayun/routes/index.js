var express = require('express'), strlib = require('../bin/str.js'), smail, path = require('path'), ersp = require('../bin/errrsp.js'), cy = require('crypto'), router = express.Router(), marked = require('marked'), fs = require('fs'), ccap = require('ccap'), aStyleMill = "color: #056db2; text-decoration: none; text-shadow: 0 0 2px rgba(0, 0, 0, 0.60);", dbc, mon, nodpath = path.join(__dirname, ".."), conts = {
    mdHelp: fs.readFileSync(nodpath + '/public/i/Mdhelp.md', 'utf8')
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
        var wi = new xgWisModel({wis: cy.randomBytes(255).toString("hex"), wisRq: cy.randomBytes(255).toString("hex"), session: {},
            ip: req.ip});
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
                if(!s[0].ip){
                    s[0].set("ip",req.ip);
                }
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
/*
 //////   ////   /////
 /       /    /  /    /
 /////   /    /  /    /
 /       /    /  /////
 /       /    /  /   /
 /        ////   /    /


 /////   //////  /////   /    /   ////
 /    /  /       /    /  /    /  /    /
 /    /  /////   /////   /    /  /
 /    /  /       /    /  /    /  /  ///
 /    /  /       /    /  /    /  /    /
 /////   //////  /////    ////    ////

 REMOVE IT BY YOUR SELF!

*/
router.use(function (req, res, next) {
     setTimeout(next,250);
});
router.use(function (req, res, next) {
    wisGen(req, res, function (wis, chk, wi) {
        res.locals.wisChk = chk;
        res.sessWi = wi;
        next();
    });
});
router.use(function (req, res, next) {
    res.sessWi.usersWithZx(function(un, isn){
        res.locals.lognUsn = un;
        res.locals.lognIsReg = isn;
        res.locals.dbdStyle= (un.length>0?"text-align: right;":"");
        next();
    });
});
router.use(function (req, res, next) {
    if(decodeURIComponent(JSON.stringify(req.query)).match(/javascript:/)){
        res.send("XXS Denied");
        res.end();
    }else{
        next();
    }
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
    res.render('login', { title: "登录", usr: req.params.usr,redir: req.query.redirect || "/" });
});
router.get('/register', function (req, res) {
    function r(){
        wi.username(function(c){
            dbc.model('xgUser').count({},function(e,d){
                if(e){d=-1}
                res.render('register', { title: (c.length>0?"注册第"+ (c.split(', ').length+1)+"个帐号":"注册"),isTow: c.length>0
                    , c_u:d });
            });
        });
    }
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
                r();
            }
        });
    } else {
        r();
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
                    var dte=new Date();
                    dbc.model('xgUser').count({},function(e,c){
                        if(e){c=-1}
                        res.render('zcStun', { title: "注册", uud:true, username:s[0].name, time: dte.toLocaleString(), usercount: c});
                    });
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
            } else if(mbname.match(/,/)) {
                res.send({successed: false, errName: "用户名什么都可以包括，就是不能有半角逗号。"});
            } else {
                var xgRegTaskModel = dbc.model('xgRegTask');
                xgRegTaskModel.find({name: mbname, confired: true},function(e,s){
                    if(e){s=[];}
                    if(s.length>0){
                        res.send({successed: false, errName: "用户名已存在"});
                        return;
                    }
                    var ddcTask = new xgRegTaskModel({name: mbname, password: strlib.sha512(mbpasswd), regIp: req.ip, regDate: new Date(),
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
                    if(s[0].lastCode == req.body.code && s[0].lastCode.length > 0){
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
                                    "<br>或者，您也可以<a href='https://websint.org/register/doInputMar?code="+s[0].lastCode+"' style='"+aStyleMill+"'>点击这个链接</a>完成验证。" +
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
router.get('/register/doInputMar', function(req, res){
    if(req.query.code){
        res.render('doInputMar', {code: req.query.code});
    }else{
        res.redirect('/register/2');
    }
});
router.post('/register/finish', function (req, res) {
    wisChk(req, res, function () {
        var wi = res.sessWi;
        var xgRegTaskModel = dbc.model('xgRegTask');
        if(!req.body.sex){
            res.send({error: -1});
            return;
        }
        var tsex=strlib.strsftrim(req.body.sex);
        if(tsex.length>5 || tsex.length < 1){
            res.send({error: -2});
            return;
        }
        xgRegTaskModel.find({_id: wi.session.reg}, function (e, s) {
            if (e) {
                s = []
            }
            if (s.length > 0) {
                if(s[0].confired){
                    var xgUserModel = dbc.model('xgUser');
                    var ddcUser=new xgUserModel({
                        name: s[0].name,
                        password: s[0].password,
                        regIp: req.ip,
                        regDate: new Date(),
                        lastIp: req.ip,
                        log: [],
                        email: s[0].email,
                        headPics: []
                    });
                    ddcUser.save(function(err){
                        if (e) {
                            res.send({errName: err.message + "，请稍候重试。"});
                        } else {
                            var xgUserXzModel = dbc.model('xgUserXz');
                            var tdz=new xgUserXzModel({
                                userId: ddcUser.id.toString(),
                                userName: ddcUser.name,
                                sex: tsex
                            });
                            tdz.save(function(){
                                wi.addLoginedUser(ddcUser,req.headers['user-agent'],{type: "web"},function(){
                                    delete wi.session.reg;
                                    wi.markModified('session');
                                    wi.save(function(e){
                                        if(e){
                                            res.send({errName: e.message + "，请稍候重试。"});
                                        }else{
                                            s[0].remove();
                                            res.send({successful:true});
                                        }
                                    });
                                });
                            });
                        }
                    });
                }else{
                    res.send({error: "-"});
                }
            } else {
                res.send({error: "-"});
            }
        });
    });
});
router.post('/login', function (req, res) {
    res.end();
});
router.get('/register/:usr', function (req, res) {
    res.redirect('/register');
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
router.post('/usr/logout', function(req, res){
    wisChk(req, res, function () {
        var wi = res.sessWi;
        var xwUsrid=strlib.strsftrim(req.body.userid);
        var xgUserModel = dbc.model('xgUser');
        xgUserModel.find({_id: xwUsrid},function(e,s){
            if(e){s=[]}
            if(s.length<1){
                res.send({error: "用户不存在"});
            }else{
                wi.logoutA(s[0],req.headers['user-agent'],{type: "web"},function(){
                    res.send({});
                });
            }
        });
    });
});
router.post('/usr/login',function(req,res){
    wisChk(req, res, function () {
        var wi = res.sessWi;
        var mName = strlib.strsftrim(req.body.name);
        var mPass = req.body.passwd;
        var xgUserModel = dbc.model('xgUser');
        xgUserModel.find({name:mName},function(e,s){
            if(e){s=[]}
            if(s.length<1){
                res.send({unerror: "用户不存在"});
            }else{
                wi.tryLogin(s[0],mPass,req.headers['user-agent'],{type: "web"},function(b){
                    if(b){
                        res.send({});
                    }else{
                        res.send({perror: "密码错误"});
                    }
                });
            }
        });
    });
});
router.get('/u/:usr?', function(req,res)    {
    var wi=res.sessWi;
    function rend(xusr){
        var xgUserXzModel = dbc.model('xgUserXz');
        xusr.getXz(function(xzs){
            wi.isLoginName(xusr.name,function(hasPrem){
                marked(new xgUserXzModel(xzs[0]).get('welcomeuserpage'), function (err, content) {
                    res.render("usrpage",{title: xusr.name, xusr: xusr, xzs: xzs,wel: content,hasPrem: hasPrem});
                });
            });
        });
    }
    var xgUserModel = dbc.model('xgUser');
    var ur=strlib.strsftrim(req.params.usr || "");
    if(!ur){
        wi.users(function(u){
            if(u.length<1){
                res.redirect("/login?redirect=/u");
            }else{
                res.redirect("/u/"+encodeURIComponent(u[0].xUsr.name));
            }
        });
    }else{
        xgUserModel.find({name:ur},function(e,s){
            if(e){s=[];}
            if(s.length<1){
                var er=new Error("用户不存在");
                er.status="ITEM_NOTFIND";
                ersp(res, er, 404);
            }else{
                rend(s[0]);
            }
        });
    }
});
router.post('/usetx/:usrid?', function (req, res) {
    wisChk(req, res, function () {
        var wi = res.sessWi;
        var usr=req.params.usrid;
        wi.isLoginId(usr,function(hasPrem){
            if(!hasPrem){
                res.send({error: "请先登录。"})
            }else{
                var xgUserModel = dbc.model('xgUser');
                xgUserModel.findById(usr,function(e,s){
                    if(e){res.send({error: e.message});
                        return;}
                    if(!s){
                        res.send({error:"-"});
                        return;
                    }
                    s.getXz(function(fr){
                        var ir=fr[0];
                        if(!ir){
                            res.send({error:"没有创建资料"});
                            return;
                        }
                        if(req.body.hasOwnProperty("sex")){
                            var tsex=strlib.strsftrim(req.body.sex);
                            if(tsex.length>5 || tsex.length < 1){
                                res.send({error: -2, unsc: ir.sex});
                            }else{
                                ir.sex=tsex;
                                ir.save(function(){
                                    res.send({});
                                });
                            }
                        }else if(req.body.hasOwnProperty("sign")){
                            var tsign=strlib.strsftrim(req.body.sign);
                            if(tsign.length>255 || tsign.length < 1){
                                res.send({error: -2, unsc: ir.get('sign')});
                            }else{
                                ir.set('sign',tsign);
                                ir.save(function(){
                                    res.send({});
                                });
                            }
                        }else if(req.body.hasOwnProperty("welcomeuserpage")){
                            var twelcomeuserpage=req.body.welcomeuserpage.trim();
                            if(twelcomeuserpage.length>4000 || twelcomeuserpage.length < 1){
                                res.send({error: -2, unsc: ir.get('welcomeuserpage')});
                            }else{
                                ir.set('welcomeuserpage',twelcomeuserpage);
                                ir.save(function(){
                                    marked(twelcomeuserpage, function (err, content) {
                                        res.send({rended: content});
                                    });
                                });
                            }
                        }else{
                            res.send({});
                        }
                    });
                });
            }
        });
    });
});
router.get('/ux/:usrid/:xz', function (req, res) {
    var usr=req.params.usrid;
    var xgUserModel = dbc.model('xgUser');
    xgUserModel.findById(usr,function(e,s){
        if(e){res.send({error: e.message});
            return;}
        if(!s){
            res.send({error:"用户不存在"});
            return;
        }
        s.getXz(function(fr){
            var ir=fr[0];
            if(!ir){
                res.send({error:"没有创建资料"});
                return;
            }
            if(req.params.xz.length>0){
                res.send({val: ir.get(req.params.xz)});
            }else{
                res.send({});
            }
        });
    });
});
router.post('/f/touch/:fname', function(req, res){
    wisChk(req, res, function () {
        var wi = res.sessWi;
        var fname=strlib.strsftrim(req.params.fname);
        if(fname.length<1 || fname.length>255){
            res.send({error: "Fname inv."});
            return;
        }
        var length=parseInt(req.body.len);
        if(!length>0){
            res.send({error: "Length inv."});
            return;
        }
        var xgFileModel = dbc.model('xgFile');
        wi.users(function(c){
            if(c.length<1){
                res.send({error: "未登录。"});
                return;
            }
            var ifile=new xgFileModel({name: fname,
                length: length,
                chunks: [],
                uploader: c[0].xUsr._id.toString(),
                uploaddate: new Date(),
                uploadip: req.ip});
            ifile.save();
            res.send({id: ifile._id.toString()});
        });
    });
});
var bodyParser = require('body-parser');
///// !!!!!!!!!!!!!!!TODO: Add an Mutex lock!!!!
router.post('/f/write/:fid', function(req, res){
    wisChk(req, res, function () {
        var wi = res.sessWi;
        var fid=strlib.strsftrim(req.params.fid);
        var length=parseInt(req.body.len);
        if(!length>0){
            length=0;
        }
        var baseed=strlib.strsftrim(req.body.blob);
        try{
            var bff=new Buffer(baseed, 'base64');
            if(bff.length<1){
                res.send({error: "No data send."});
                return;
            }
            if(length==0){
                length=bff.length;
            }
            if(bff.length!=length){
                res.send({error: "data length not match."});
                return;
            }
            var xgFileModel = dbc.model('xgFile');
            wi.users(function(c){
                if(c.length<1){
                    res.send({error: "未登录。"});
                    return;
                }
                xgFileModel.findById(fid,function(e,s){
                    if(!s){
                        res.send({error: "File("+fid+") Not find."});
                    }else{
                        s.hasPrem(wi,function(t){
                            if(!t){
                                res.send({error: "Access denied"});
                            }else{
                                var spaceIndex=parseInt(req.body.i);
                                var spaceLen=length;
                                if(isNaN(spaceIndex) || (!spaceLen>0)){
                                    res.send({error: "OK."});
                                }else{
                                    s.allocedLength(function(lad){
                                        if(lad+spaceLen-(s.chunks[spaceIndex]?s.chunks[spaceIndex].length:0)> s.length){
                                            res.send({error: "May overflow."});
                                        }else{
                                            var xgFileChunkModel = dbc.model('xgFileChunk');
                                            var chk=new xgFileChunkModel({file: s._id.toString(),
                                                index: spaceIndex,
                                                length: spaceLen,
                                                data: bff});
                                            chk.save(function(){
                                                s.chunks[spaceIndex]=chk._id.toString();
                                                s.markModified("chunks");
                                                s.save(function(){
                                                    console.info(s.chunks);
                                                    res.send({lengthReceived: spaceLen});
                                                });
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }catch (e){
            res.send({error: e});
        }
    });
});
router.get('/f/:fid/:fname?', function(req, res){
    var fid=strlib.strsftrim(req.params.fid);
    var xgFileModel = dbc.model('xgFile');
    xgFileModel.findById(fid, function(e, s){
        if(!s){
            var er=new Error("用户不存在");
            er.status="ITEM_NOTFIND";
            ersp(res, er, 404);
        }else{
            s.content(function(ct){
                res.header("Content-Disposition","attachment;filename="+strlib.strsftrim(s.name));
                res.send(ct);
            });
        }
    });
});
module.exports = function (d) {
    mon = d.mongo;
    dbc = d.db;
    strlib.init();
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
        ip: String,
        session: {type: {
            reg: String,
            users: [xgUser]
        }, default: {}}
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
        }else if(this.session.users && this.session.users.length>0){
            var users="";
            for(var i=0;i<this.session.users.length;i++){
                users+=this.session.users[i].xgUser.name + (i==this.session.users.length-1?"":", ");
            }
            callback(users);
        }else{
            callback("");
        }
    };
    xgWis.methods.users = function (callback) {
        if (this.session.reg) {
            var xgRegTaskModel = dbc.model('xgRegTask');
            xgRegTaskModel.find({_id: this.session.reg}, function (e, s) {
                if (e) {
                    s = []
                }
                if (s.length > 0) {
                    callback([s[0].name], true);
                }else{
                    callback([]);
                }
            });
        }else if(this.session.users && this.session.users.length>0){
            var users=[];
            for(var i=0;i<this.session.users.length;i++){
                (function(t,i){
                    var str={toString: function(){return t.session.users[i].xgUser.name;}};
                    str.xUsr=t.session.users[i].xgUser;
                    users.push(str);
                })(this,i)
            }
            callback(users);
        }else{
            callback([]);
        }
    };
    xgWis.methods.usersWithZx = function (callback) {
        this.users(function(u,s){
            if(u.length<1){
                callback([]);
            }else if(s){
                callback([]);
            }else{
                function bm(i){
                    if(i>= u.length){
                        callback(u);
                    }else{
                        new xgUserModel(u[i].xUsr).getXz(function(e){
                            u[i].uxz=e;
                            bm(i+1);
                        });
                    }
                }
                bm(0);
            }
        });
    };
    xgWis.methods.isLoginName = function(user,callback){
        if(this.session.users && this.session.users.length>0){
            for(var i=0;i<this.session.users.length;i++){
                if(this.session.users[i].xgUser.name == user){
                    callback(true);
                    return;
                }
            }
            callback(false);
        }else{
            callback(false);
        }
    };
    xgWis.methods.isLoginId = function(idr,callback){
        if(this.session.users && this.session.users.length>0){
            for(var i=0;i<this.session.users.length;i++){
                if(this.session.users[i].xgUser._id.toString() == idr){
                    callback(true);
                    return;
                }
            }
            callback(false);
        }else{
            callback(false);
        }
    };
    xgWis.methods.logoutAll = function(ua,client,callback){
        var t=this;
        if(t.session.users){
            function fall(){
                t.session.users=[];
                t.markModified("session.users");
                t.save(function(){
                    callback();
                });
            }
            function delU(i){
                if(i>= t.session.users.length){
                    fall();
                }else{
                    var tsp=new xgUserModel(t.session.users[i].xgUser);
                    tsp.log.push(new uLogModel({
                        date: new Date(),
                        ip: t.ip,
                        action: "logouted",
                        uA: ua,
                        value: {client: client}
                    }));
                    tsp.markModified("log");
                    tsp.save(function(){
                        delU(i+1);
                    });
                }
            }
            delU(0);
        }else{
            callback();
        }
    };
    xgWis.methods.logoutA = function(xgUser,ua,client,callback){
        var t=this;
        if(t.session.users){
            var toRm=[];
            function fall(){
                // [1,2,4,3] - [2,4]
                // i->0,j->0 1!=2
                // i->0,j->1 1!=4
                // (Here loop end, i++)
                // i->1,j->0 2==2 deleted
                // [1,4,3]
                // i--
                // (Here loop end, i++)
                // i->1 j->0 4!=2
                // i->1 j->1 4==4 deleted
                // [1,3] ----------------------------------------
                // i--
                // (Here loop end, i++)                         |
                // i->1 j->0 3!=2
                // i->1 j->1 3!=4
                // (j->2)!<2                                     |
                // (Here loop end, i++)
                // (i->2)!<2
                // [1,2,4,3] - [2,4] = [1,3] <-------------------|
                var arr=t.session.users;
                for(var i=0;i<arr.length;i++){
                    for(var j=0;j<toRm.length;j++){
                        if(new xgUserModel(arr[i].xgUser).id==toRm[j].id){
                            arr.splice(i,1);
                            i--;
                            break;
                        }
                    }
                }
                t.session.users=arr;
                t.markModified("session.users");
                t.save(function(){
                    callback();
                });
            }
            function delU(i){
                if(i>= t.session.users.length){
                    fall();
                }else{
                    var tsp=new xgUserModel(t.session.users[i].xgUser);
                    if(tsp.id == xgUser.id){
                        tsp.log.push(new uLogModel({
                            date: new Date(),
                            ip: t.ip,
                            action: "logouted",
                            uA: ua,
                            value: {client: client}
                        }));
                        tsp.markModified("log");
                        tsp.save(function(){
                            toRm.push(tsp);
                            delU(i+1);
                        });
                    }else{
                        delU(i+1);
                    }
                }
            }
            delU(0);
        }else{
            callback();
        }
    };
    xgWis.methods.addLoginedUser = function(xgUser,ua,client,callback){
        var t=this;
        t.logoutA(xgUser,ua,client,function(){
            var usert={xgUser:xgUser};
            xgUser.log.push(new uLogModel({
                date: new Date(),
                ip: t.ip,
                action: "logined",
                uA: ua,
                value: {client: client}
            }));
            xgUser.markModified("log");
            xgUser.save(function(){
                if(t.session.users){
                    t.session.users.push(usert);
                }else{
                    t.session.users=[usert];
                }
                t.markModified("session.users");
                t.save(function(){
                    callback();
                });
            });
        });
    };
    xgWis.methods.tryLogin = function(xgUser,password,ua,client,callback){
        var t=this;
        if(xgUser.password==strlib.sha512(password)){
            t.addLoginedUser(xgUser,ua,client,function(){
                callback(true);
            });
        }else{
            callback(false);
        }
    };
    xgUser.methods.getXz=function(callback){
        xgUserXzModel.find({userId: this.id},function(e,s){
            if(e){s=[]}
            callback(s);
        });
    };
    var xgMil = new mon.Schema({
        auth_user: {type: String, default: ""},
        auth_wis: String,
        subject: String,
        content: String,
        readFromWeb_can: {type: Boolean, default: true}
    });
    var xgUserXz = new mon.Schema({
        userId: String,
        userName: String,
        sex: {type: String, default: "性别未知"},
        sign: {type: String,default:"窝正在完善资料！"},
        welcomeuserpage: {type: String, default:"欢迎访问窝的**用户页**！"}
    });
    xgMil.methods.canShow = function (usr, wis) {
        return this.readFromWeb_can && ((usr == this.auth_user && this.auth_user != "") || (this.auth_user.length < 0 && this.auth_wis == wis));
    };
    var xgUserModel = dbc.model('xgUser', xgUser);
    var xgRegTaskModel = dbc.model('xgRegTask', xgRegTask);
    var xgWisModel = dbc.model('xgWis', xgWis);
    var xgMilModel = dbc.model('xgMil', xgMil);
    var xgUserXzModel = dbc.model('xgUserXz', xgUserXz);
    var uLogModel = dbc.model('uLog', uLog);
    var xgFile = new mon.Schema({
        name: String,
        length: Number,
        chunks: [String],
        uploader: String,
        uploaddate: Date,
        uploadip: String
    });
    var xgFileChunk = new mon.Schema({
        file: String,
        index: Number,
        length: Number,
        data: Buffer
    });
    xgFile.methods.hasPrem=function(wis,callback){
        wis.isLoginId(this.uploader,function(t){
            callback(t);
        });
    };
    xgFileChunk.methods.getFile=function(callback){
        xgFileModel.findById(this.file,function(e,s){
            if(s){
                callback(s);
            }else{
                this.remove();
                callback(null);
            }
        });
    };
    xgFile.methods.getChunks=function(callback){
        var chk=this.chunks;
        var fs=[];
        function d(i){
            if(i>=chk.length){
                callback(fs);
            }else{
                xgFileChunkModel.findById(chk[i],function(e,s){
                    if(s){
                        fs.push(s);
                    }else{
                        fs.push(null);
                    }
                    d(i+1);
                });
            }
        }
        d(0);
    };
    xgFile.methods.allocedLength=function(callback){
        this.getChunks(function(chks){
            var len=0;
            for(var i=0;i<chks.length;i++){
                len+=chks[i]?chks[i].length:0;
            }
            callback(len);
        });
    };
    xgFile.methods.content=function(callback){
        var f=this;
        f.allocedLength(function(l){
            if(f.length>l){
                callback(new Buffer("updata not finish.("+l+" != "+f.length+")"));
            }else{
                f.getChunks(function(d){
                    var bffers=[];
                    for(var i=0;i<d.length;i++){
                        bffers.push(d[i].data);
                    }
                    var bff=Buffer.concat(bffers);
                    callback(bff);
                });
            }
        });
    };
    var xgFileModel = dbc.model('xgFile', xgFile);
    var xgFileChunkModel = dbc.model('xgFileChunk', xgFileChunk);
    smail = require('../bin/mail.js')(dbc, mon, d.passR);
    marked(conts.mdHelp, function (err, content) {
        conts.mdHelpmded=content;
    });
    return router;
};

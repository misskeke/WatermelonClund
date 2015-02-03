module.exports = function(f,dbc,marked,router,ersp,cy){
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
    router.use(function(req, res, next){
        if(req.body && req.isParsedBody){
            for(var i in req.body){
                if(req.body.hasOwnProperty(i)){
                    if(req.body[i].length>10000){
                        var errstr="字段 "+i+" 过长（超过10000）";
                        res.send({error: errstr, err: errstr, error_msg: errstr, preview:"", ok: false, successed: false, successful: false});
                        return;
                    }
                }
            }
        }
        next();
    });
    router.use(function(req, res, next){
        if(!req.path.match(/^\/[ijs]\//)){
            next();
            return;
        }
        if(req.get("host")=="static.websint.org"){
            next();
        }else{
            res.redirect(301,"https://static.websint.org"+req.path);
        }
    });
    f(wisChk,markusedVcode);
}

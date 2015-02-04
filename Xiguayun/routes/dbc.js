var strlib = require('../bin/str.js');
module.exports = function(dbc,mon){
    var uLog = new mon.Schema({
        date: Date,
        ip: String,
        action: String,
        uA: String,
        value: {}
    });
    var xgUser = new mon.Schema({
        name: String,
        password: String,
        regIp: String,
        regDate: Date,
        lastIp: String,
        log: [uLog],
        email: String,
        headPics: [{}]
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
                callback([],s);
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
    }, { strict: false });
    xgMil.methods.canShow = function (usr, wis) {
        return this.readFromWeb_can && ((usr == this.auth_user && this.auth_user != "") || (this.auth_user.length < 0 && this.auth_wis == wis));
    };
    xgUser.methods.picRemoveall=function(callback){
        var pp=this.get("headPics");
        pp.splice(0,pp.length-1);
        console.info(pp);
        this.set("headPics",pp);
        this.markModified("headPics");
        this.save(callback);
    };
    xgUser.methods.addHeadpic=function(picid,text,callback){
        var pics=this.get("headPics");
        if(!pics){
            pics=[];
        }
        pics.push({picid: picid, text: text});
        this.set("headPics",pics);
        this.markModified("headPics");
        this.save(callback);
    };
    xgUser.methods.getPic=function(c){
        var pics=this.get("headPics");
        if(!pics){
            pics=[];
        }
        if(pics[pics.length-1]){
            c(pics[pics.length-1]);
        }else{
            c({picid: "548bc1f81324aae176d9ce70", text: "-"});
        }
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
        uploadip: String,
        addingChunk: {type: Boolean, default: false}
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
    var xgBar = new mon.Schema({
        name: String,
        wikiDef: String,
        wikiUrl: String,
        parent: String,
        creatoTask: String,
        vail: {type: Boolean, default: true}
    });
    var xgSenwTask = new mon.Schema({
        uid: String,
        reason: String,
        type: String,
        ip: String,
        info: {},
        opSw: Number,
        undone: Boolean,
        undoOpDoerSw: Number,
        undoTask: String
    });
    var xgBarModel = dbc.model('xgBar', xgBar);
    var xgSenwTaskModel = dbc.model('xgSenwTask', xgSenwTask);
}


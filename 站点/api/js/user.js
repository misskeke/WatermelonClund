(function () {
    XAPI.user = {};
    XAPI.log("Checking localstorage");
    var username = "";
    var password = "";
    var sid=0;
    var krr="";
    var uid=-1;
    var usrinfo;
    var autolog = false;
    if (!window.localStorage) {
        XAPI.log("You Boswer did not support localStorage!");
        XAPI.ui.addState("您的浏览器不支持HTML5的localStorage，因此您不能记住用户名和密码。请换更新的浏览器（如chrome）");
        XAPI.supportRemember = false;
        window.localStorage = {};
    } else {
        XAPI.log("Checking localstorage contant...");
        if (window.localStorage.userName) {
            XAPI.log("find user!");
            username = window.localStorage.userName;
            password = window.localStorage.userPasswd;
            autolog = window.localStorage.autolog=="true" | false;
            XAPI.ui.addState("发现曾经登录过的用户："+username);
        } else {
            XAPI.log("You had never logined here!");
        }
    }
    function rtt() {
        function nol(){
            var as=XAPI.setdh("<a class='dh_link' href='javascript:XAPI.showWorld();'>世界</a><span class='hidden'>   |   </span><a class='dh_link' href='javascript:XAPI.showLogin();'>登录</a><span class='hidden'>|</span><a class='dh_link' href='javascript:XAPI.showRegister();'>注册</a>").find("a");
            XAPI.ui.addState("您从未在这里登录过，请登录或注册。");
        }
        if(localStorage.lastSid){
            if(localStorage.lastKrr){
                sid=localStorage.lastSid;
                krr=localStorage.lastKrr;
                uid=localStorage.lastUid;
                XAPI.send("api/checksession.php",{},function(q){
                    if(q.successful==1){
                        XAPI.loggedShow();
                        XAPI.ui.addState("您曾经登录过但是并未注销！已为您登录");
                    }else{
                        XAPI.log("seassion sid="+sid+", krr="+krr+" is incorrect!");
                        sid=0;
                        krr="";
                        uid=0;
                        delete localStorage.lastSid;
                        delete localStorage.lastKrr;
                        setTimeout(rtt,1);
                    }
                });
                return;
            }
        }
        if (!autolog) {
            nol();
        }else{
            XAPI.ui.addState("正在使用您记住的密码登录");
            XAPI.user.loginUsr(username,password,function(s,m,q){
                if(s){
                    sid= q.sid;
                    krr= q.krr;
                    uid= q.uid;
                    XAPI.log("loggened sid="+sid+", krr="+krr+", uid="+uid);
                    XAPI.ui.addState("使用您记住的密码登录成功！");
                    localStorage.lastSid=sid;
                    localStorage.lastKrr=krr;
                    localStorage.lastUid=uid;
                    XAPI.loggedShow();
                }else{
                    localStorage.autolog=false;
                }
            });
        }
    }
    setTimeout(rtt, 400);
    XAPI.sendTieShow=function(reply_tid,arr){
        var body=$('body');
        var maint=$('<div style="background-color: rgba(0, 0, 0, 0.60); position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1504;"></div>');
        body.append(maint);
        var ttd=$('<div style="margin: 32px auto auto auto; position: relative; border-radius: 4px; background-color: rgba(255, 255, 255, 0.80); height: 300px; width: 750px; padding: 4px;"></div>');
        maint.append(ttd);
        var edit=XAPI.ui.createDTextArea("推文...");
        if(arr){
            edit.text(arr);
        }
        edit.ipt.css({position:"absolute",left:"2px",right:"2px",top:"16px",bottom:"40px"});
        ttd.append(edit.ipt);
        var dbd=$('<div style="position: absolute; font-size: 16px; left: 2px; right: 2px; bottom: 2px; height: 36px; text-align: right;"></div>');
        var cancel=XAPI.ui.createDBotton("取消");
        cancel.click(function(){
            maint.animate({opacity:0,bottom:(window.innerHeight)+"px"},150,function(){
                maint.remove();
            });
        });
        var ok=XAPI.ui.createDBotton("发推");
        var picinp=XAPI.ui.createDBotton("插入图片");
        ok.click(function(){
            XAPI.ui.addState("正在发推");
            dbd.find(".log_and_error").remove();
            cancel.css({display:"none"});
            ok.css({display:"none"});
            picinp.css({display:"none"});
            dbd.append($('<span class="log_and_error" style="font-size: 80%; color: #5d5d5d;">请稍候</span>'));
            XAPI.send("api/send_tui.php",{content:edit.text(),reply:reply_tid},function(q){
                XAPI.ui.addState("");
                if(q.errid!=0){
                    dbd.find(".log_and_error").remove();
                    dbd.append($('<span class="log_and_error error" style="font-size: 80%;"></span>').text(q.errmsg));
                    cancel.css({display:"inline-block"});
                    ok.css({display:"inline-block"});
                    picinp.css({display:"inline-block"});
                }else{
                    cancel.click();
                }
            });
        });
        dbd.append(picinp);
        dbd.append(cancel).append(ok);
        ttd.append(dbd);
        picinp.click(function(){
            XAPI.user.updateImage(function(imgs){
                var itext="";
                for(var i=0;i<imgs.length;i++){
                    (function(img){
                        itext+="\\p="+img+"/";
                    })(imgs[i]);
                }
                edit.text(edit.text()+itext);
            },true);
        });
        maint.css({opacity:0,bottom:(window.innerHeight)+"px"}).animate({opacity:1,bottom:"0px"},150);
    };
    XAPI.cpXXCode=function(xxcode){
        // XXCODE示例：
        // 这是文字这是文字这是文字这是文字这是文字这是\p=123456/pid为123456的图片这是刚刚的代码\\p=123456/。
        var chunks=[];
        for(var now=0; now<xxcode.length; now++){
            if(xxcode.charAt(now)!="\\"){
                chunks.push({str:xxcode.charAt(now)});
            }else{
                if(xxcode.charAt(now+1)=="p" && xxcode.charAt(now+2)=="="){
                    var numsbui="";
                    var nowc=2;
                    while(true){
                        nowc++;
                        if(xxcode.charAt(now+nowc)=="/"){
                            break;
                        }else{
                            numsbui+=xxcode.charAt(now+nowc);
                        }
                        if(xxcode.charAt(now+nowc).length<1){
                            return [{str:"此处的代码有问题"}];
                        }
                    }
                    chunks.push({picid:numsbui});
                    now+=nowc;
                }else if(xxcode.charAt(now+1)=="\\" && xxcode.charAt(now+2)=="p" && xxcode.charAt(now+3)=="="){
                    chunks.push({str:"\\"});
                    now++;
                }else{
                    chunks.push({str:"\\"+xxcode.charAt(now+1)});
                    now++;
                }
            }
        }
        return chunks;
    };
    XAPI.loggedShow=function(){
        XAPI.ui.addState("");
        XAPI.log("logined sid: "+sid);
        XAPI.user.uid=uid;
        XAPI.send("api/user_get_info.php",{user:username},function(q){
            if(q.errid==0){
                usrinfo= q.user;
            }
            var dh=XAPI.setdh("<a class='dh_link' href='javascript:XAPI.showWorld();'>世界</a><span class='hidden'> </span><a class='dh_link' href='javascript:XAPI.sendTieShow();'>发推</a>");
            var userbar=$('<a class="dh_link" style="display: inline-block; position: relative; float: right; padding-left: 8px; padding-right: 8px; margin-right: 18px;" href="javascript:void(0)"></a>');
            userbar.text(username);
            userbar.append($('<span class="iconfont" style="margin-left: 4px; font-size: 75%;">&#xe607;</span>'));
            userbar.css({opacity:0,left:"100px",cursor:"pointer"}).animate({opacity:1,left:"0px"},300);
            $('.dh').append(userbar);
            var usermenubak=$('<div style="display: none; position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1503; background-color: rgba(0,0,0,0)"></div>');
            var usermenu=$('<div style="position: fixed; z-index: 1505; background-color: #ffffff; box-shadow: 1px 1px 3px #000; min-height: 12px; min-width: 100px; padding-top: 4px; padding-bottom: 4px;"></div>');
            usermenu.css({display:"none",opacity:0});
            var lock=false;
            var opened=false;
            userbar.click(function(){
                if(lock==true){
                    return;
                }
                lock=true;
                var lt=userbar.offset();
                usermenu.stop(true,false,false);
                usermenu.css({right:"18px",top:userbar.height()+"px",opacity:(opened?1:0),display:"block"}).animate({opacity:(opened?0:1)},80,function(){
                    if(opened){
                        usermenu.css({display:"none"});
                        usermenubak.css({display:"none"});
                        opened=false;
                    }else{
                        usermenubak.css({display:"block"});
                        opened=true;
                    }
                    lock=false;
                });
            });
            usermenubak.click(function(){
                if(opened){
                    if(lock==true){
                        return;
                    }
                    userbar.click();
                }
            });
            usermenu.append($('<a href="javascript:void(0);" class="usermenu_item"></a>').append($('<img style="display: inline-block; vertical-align: middle; margin: 3px;">')
                .attr("src",XAPI.user_hadpic_get(usrinfo.email,42))).append(
                    $('<div style="vertical-align: middle; margin: 3px; display: inline-block;"></div>')
                        .append($('<div style="font-size: 110%; line-height: 25px;"></div>').text(username)).append(
                            $('<div style="opacity: 0.75; font-size: 80%; line-height: 18px;"></div>').text(usrinfo.email))).click(function(){
                    var hash=window.location.hash.substr(1);
                    var hastt;
                    try{
                        hastt=JSON.parse(hash);
                    }catch (e){
                        XAPI.log("Page hash error: "+e);
                        hastt={};
                    }
                    XAPI.showUser(usrinfo.uid,hastt);
                }));
            usermenu.append($('<a href="javascript:void(0);" class="usermenu_item">登出</a>').click(function(){
                XAPI.ui.addState("正在登出");
                XAPI.send("api/logout.php",{},function(q){
                    XAPI.ui.addState("登出成功！");
                    username="";
                    password="";
                    sid=0;
                    krr="";
                    uid=0;
                    delete localStorage.lastSid;
                    delete localStorage.lastKrr;
                    delete localStorage.lastUid;
                    delete localStorage.userName;
                    delete localStorage.userPasswd;
                    $('body').append($('<div style="background-color: #000000; opacity: 0; position: absolute; z-index: 99999; top: 0; left: 0; right: 0; bottom: 0;"></div>').animate({opacity:0.4},900));
                    setTimeout(function(){
                        X_RELOAD();
                    },1000);
                })
            }));
            usermenu.find('.usermenu_item').css({lineHeight:"28px",fontSize:"16px",cursor:"pointer",paddingLeft:"8px",display:"block",color:"#000"}).mouseenter(function(){
                $(this).css({backgroundColor:"rgba(0,0,0,0.1)",color:"#034681"});
            }).mouseleave(function(){
                    $(this).css({backgroundColor:"rgba(0,0,0,0)",color:"#000000"});
                }).click(function(){
                    usermenubak.click();
                });
            $('body').append(usermenu).append(usermenubak);
            XAPI.dhp();
        });
    };
    XAPI.user.loginUsr=function(n,p,c){
        $.post("api/login_usr.php",{u:n,p:p},function(q){
            if(q.errid==0){
                c(true,"",q);
            }else{
                c(false, q.errmsg,q);
            }
        },'json');
    };
    XAPI.send=function(u,p,q){
        p.sid=sid;
        p.krr=krr;
        $.post(u,p,q,'json');
    };
    XAPI.showLogin = function () {
        var dlcont=XAPI.showCont("<h1 style='color: #ffffff;'>登录</h1>");
        dlcont.css({overflow:"hidden"});
        var box=$('<div style="box-shadow: 0 0 100px rgba(0, 0, 0, 0.63); text-align: left; position: relative; margin: 55px auto auto auto; width: 420px; background-color: #e7e7e7;"></div>');
        dlcont.append(box);
        dlcont.find('*').css({opacity:0,x:"150px"}).eachanimate({opacity:1,x:"0px"},true,390,75,false,"easeOutExpo",function(){});
        box.append($("<div style='font-size: 100px; text-align: center;' class='iconfont'>&#xe603;</div>"));
        var usernameIpt=XAPI.ui.createDInput("&#xe600;");
        usernameIpt.texttitle("用户名");
        usernameIpt.ipt.css({width:"412px"});
        box.append(usernameIpt.ipt);
        usernameIpt.text(username);
        box.append($('<br>'));
        var passwordIpt=XAPI.ui.createDInput("&#xe601;");
        passwordIpt.texttitle("密码");
        passwordIpt.ipt.css({width:"412px"});
        passwordIpt.$edit.attr("type","password");
        box.append(passwordIpt.ipt);
        box.append($('<br>'));
        var cck=function(){
            regbtn.remove();
            box.find(".error").remove();
            password=passwordIpt.text();
            XAPI.ui.addState("正在登录");
            XAPI.user.loginUsr(usernameIpt.text(),passwordIpt.text(),function(s,m,q){
                XAPI.ui.addState("");
                if(s){
                    window.localStorage.userName= q.uname;
                    username=q.uname;
                    sid= q.sid;
                    krr= q.krr;
                    uid= q.uid;
                    XAPI.log("loggened sid="+sid+", krr="+krr+", uid="+uid);
                    XAPI.ui.addState("成功登录！");
                    localStorage.lastSid=sid;
                    localStorage.lastKrr=krr;
                    localStorage.lastUid=uid;
                    XAPI.loggedShow();
                    XAPI.showWorld();
                }else{
                    box.append($('<span class="error" style="position: relative; top: 30px;"></span>').text(m));
                    regbtn=XAPI.ui.createDBotton("登录").css({position:"absolute",right:"32px",bottom:"12px"}).click(cck);
                    box.append(regbtn);
                    password="";
                }
            });
        };
        var regbtn=XAPI.ui.createDBotton("登录").css({position:"absolute",right:"32px",bottom:"12px"}).click(cck);
        box.append(regbtn);
        box.append($('<span style="font-size: 75%; position: relative; top: 10px; opacity: 0.75;">Copyleft: Maomao XiGuaYun Psn. Ltd.</span>'));
        $("body").animate({backgroundColor:"#023868"},350);
        box.css({fontFamily:"'微软雅黑'",padding:"32px"});
        XAPI.chgUrl({loginPage:true});
    };
    XAPI.showRegister=function(){
        var dlcont=XAPI.showCont("<h1 style='color: #ffffff;'>注册</h1>");
        dlcont.css({overflow:"hidden"});
        var box=$('<div style="box-shadow: 0 0 100px rgba(0, 0, 0, 0.63); text-align: left; position: relative; margin: 55px auto auto auto; width: 420px; background-color: #e7e7e7;"></div>');
        dlcont.append(box);
        dlcont.find('*').css({opacity:0,x:"150px"}).eachanimate({opacity:1,x:"0px"},true,390,75,false,"easeOutExpo",function(){});
        box.append($("<div style='font-size: 100px; text-align: center;' class='iconfont'>&#xe604;</div>"));
        var usernameIpt=XAPI.ui.createDInput("&#xe600;");
        usernameIpt.texttitle("用户名");
        usernameIpt.ipt.css({width:"412px"});
        box.append(usernameIpt.ipt);
        box.append($('<br>'));
        var passwordIpt=XAPI.ui.createDInput("&#xe601;");
        passwordIpt.texttitle("密码");
        passwordIpt.ipt.css({width:"412px"});
        passwordIpt.$edit.attr("type","password");
        box.append(passwordIpt.ipt);
        box.append($('<br>'));
        var passwordConfIpt=XAPI.ui.createDInput("&#xe606;");
        passwordConfIpt.texttitle("再输入一遍密码");
        passwordConfIpt.ipt.css({width:"412px"});
        passwordConfIpt.$edit.attr("type","password");
        box.append(passwordConfIpt.ipt);
        box.append($('<br>'));
        var emailIpt=XAPI.ui.createDInput("&#xe605;");
        emailIpt.texttitle("邮箱");
        emailIpt.ipt.css({width:"412px"});
        box.append(emailIpt.ipt);
        box.append($('<br>'));
        var registerFunc=function(){
            regbtn.remove();
            XAPI.ui.addState("正在注册");
            box.find(".error").remove();
            if(passwordIpt.text()!=passwordConfIpt.text()){
                box.append($('<span class="error" style="position: relative; top: 30px;">两次输入的密码不一致</span>'));
                regbtn=XAPI.ui.createDBotton("注册").css({position:"absolute",right:"32px",bottom:"12px"}).click(registerFunc);
                box.append(regbtn);
                return;
            }
            password=passwordIpt.text();
            $.post("api/register_usr.php",{n:usernameIpt.text(),p:passwordIpt.text(),e:emailIpt.text()},function(q){
                XAPI.ui.addState("");
                if(q.errid!=0){
                    box.append($('<span class="error" style="position: relative; top: 30px;"></span>').text(q.errmsg));
                    password="";
                    regbtn=XAPI.ui.createDBotton("注册").css({position:"absolute",right:"32px",bottom:"12px"}).click(registerFunc);
                    box.append(regbtn);
                }else{
                    uid= q.uid;
                    XAPI.log("registered uid: "+uid);
                    box.transit({x:-1000},300,function(){
                        box.css({x:1000});
                        box.html("<span style='font-size: 200%; color: #7ece1c;'>√</span>&nbsp;成功");
                        box.transit({x:0},300,function(){
                            function tof(){
                                XAPI.user.loginUsr(q.uname,password,function(s,m,q){
                                    if(!s){
                                        box.append($('<div></div>').text(m));
                                        setTimeout(tof,10);
                                        return;
                                    }
                                    sid= q.sid;
                                    krr= q.krr;
                                    username=q.uname;
                                    localStorage.lastKrr=krr;
                                    localStorage.lastSid=sid;
                                    localStorage.lastUid=uid;
                                    localStorage.userName=username;
                                    XAPI.ui.addState("注册成功！尽情享受吧~");
                                    XAPI.loggedShow();
                                    setTimeout(function(){
                                        XAPI.showWorld();
                                    },2000);
                                })
                            }
                            setTimeout(tof,10);
                        });
                    })
                }
            },'json');
        };
        var regbtn=XAPI.ui.createDBotton("注册").css({position:"absolute",right:"32px",bottom:"12px"}).click(registerFunc);
        box.append(regbtn);
        box.append($('<span style="font-size: 75%; position: relative; top: 10px; opacity: 0.75;">Copyleft: Maomao XiGuaYun Psn. Ltd.</span>'));
        $("body").animate({backgroundColor:"#4A6E01"},350);
        box.css({fontFamily:"'微软雅黑'",padding:"32px"});
        XAPI.chgUrl({registerPage:true});
    };
    XAPI.user_hadpic_get=function(email,size){
        return "https://www.gravatar.com/avatar/"+ $.md5(email)+"?d=mm&r=pg&s="+size;
    };
    XAPI.chgUrl=function(url){
        window.location="#"+JSON.stringify(url);
    };
    $.getScript("UI/JS/imageupd.js",function(){
        XAPI.log("imageupd.js Loaded");
    });
    $.getScript("api/js/p_world.js",function(){
        XAPI.log("World Page loaded");
        $.getScript("api/js/p_user.js",function(){
            XAPI.log("user page loaded");
            $.getScript("api/js/p_img.js",function(){
                XAPI.log("p_img.js loaded");
                $.getScript("api/js/pages.js",function(){
                    XAPI.log("Pages loaded");
                    var hash=window.location.hash.substr(1);
                    var hastt;
                    try{
                        hastt=JSON.parse(hash);
                    }catch (e){
                        XAPI.log("Page hash error: "+e);
                        hastt={};
                    }
                    XAPI.pages.startPage(hastt);
                });
            });
        })
    });
})();

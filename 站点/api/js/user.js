(function () {
    XAPI.user = {};
    XAPI.log("Checking localstorage");
    var username = "";
    var password = "";
    var autolog = false;
    if (!window.localStorage) {
        XAPI.log("You Boswer did not support localStorage!");
        XAPI.supportRemember = false;
        window.localStorage = {};
    } else {
        XAPI.log("Checking localstorage contant...");
        if (window.localStorage.userName) {
            XAPI.log("find user!");
            username = window.localStorage.userName;
            password = window.localStorage.userPasswd;
            autolog = window.localStorage.autolog | false;
        } else {
            XAPI.log("You had never logined here!");
        }
    }
    setTimeout(function () {
        if (!autolog) {
            var as=XAPI.setdh("<a class='dh_link' href='javascript:XAPI.showWorld();'>世界</a><span class='hidden'>   |   </span><a class='dh_link' href='javascript:XAPI.showLogin();'>登录</a><span class='hidden'>|</span><a class='dh_link' href='javascript:XAPI.showRegister();'>注册</a>").find("a");
        }
    }, 400);
    XAPI.showLogin = function () {
        var dlcont=XAPI.showCont("<h1 style='color: #ffffff;'>登录</h1>");
        dlcont.css({overflow:"hidden"});
        var box=$('<div style="box-shadow: 0 0 100px rgba(0, 0, 0, 0.63); text-align: left; position: relative; margin: 55px auto auto auto; width: 420px; background-color: #e7e7e7;"></div>');
        dlcont.append(box);
        dlcont.find('*').css({opacity:0,x:"150px"}).eachanimate({opacity:1,x:"0px"},true,390,75,false,"easeOutExpo",function(){});
        box.append($("<div style='font-size: 100px; text-align: center;' class='iconfont'>&#xe603;</div>"));
        var usernameIpt=XAPI.ui.createDInput("&#xe600;");
        usernameIpt.texttitle("用户名");
        usernameIpt.ipt.css({width:"380px"});
        box.append(usernameIpt.ipt);
        box.append($('<br>'));
        var passwordIpt=XAPI.ui.createDInput("&#xe601;");
        passwordIpt.texttitle("密码");
        passwordIpt.ipt.css({width:"380px"});
        passwordIpt.$edit.attr("type","password");
        box.append(passwordIpt.ipt);
        box.append($('<br>'));
        box.append(XAPI.ui.createDBotton("登录").css({position:"absolute",right:"32px",bottom:"12px"}));
        box.append($('<span style="font-size: 75%; position: relative; top: 10px; opacity: 0.75;">Copyleft: Maomao XiGuaYun Psn. Ltd.</span>'))
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
        usernameIpt.ipt.css({width:"380px"});
        box.append(usernameIpt.ipt);
        box.append($('<br>'));
        var passwordIpt=XAPI.ui.createDInput("&#xe601;");
        passwordIpt.texttitle("密码");
        passwordIpt.ipt.css({width:"380px"});
        passwordIpt.$edit.attr("type","password");
        box.append(passwordIpt.ipt);
        box.append($('<br>'));
        var passwordConfIpt=XAPI.ui.createDInput("&#xe606;");
        passwordConfIpt.texttitle("再输入一遍密码");
        passwordConfIpt.ipt.css({width:"380px"});
        passwordConfIpt.$edit.attr("type","password");
        box.append(passwordConfIpt.ipt);
        box.append($('<br>'));
        var emailIpt=XAPI.ui.createDInput("&#xe605;");
        emailIpt.texttitle("邮箱");
        emailIpt.ipt.css({width:"380px"});
        box.append(emailIpt.ipt);
        box.append($('<br>'));
        var registerFunc=function(){
            regbtn.remove();
            box.find(".error").remove();
            if(passwordIpt.text()!=passwordConfIpt.text()){
                box.append($('<span class="error" style="position: relative; top: 30px;">两次输入的密码不一致</span>'));
                regbtn=XAPI.ui.createDBotton("注册").css({position:"absolute",right:"32px",bottom:"12px"}).click(registerFunc);
                box.append(regbtn);
                return;
            }
            $.post("api/register_usr.php",{n:usernameIpt.text(),p:passwordIpt.text(),e:emailIpt.text()},function(q){
                if(q.errid!=0){
                    box.append($('<span class="error" style="position: relative; top: 30px;"></span>').text(q.errmsg));
                    regbtn=XAPI.ui.createDBotton("注册").css({position:"absolute",right:"32px",bottom:"12px"}).click(registerFunc);
                    box.append(regbtn);
                }else{
                    var uid= q.uid;
                    XAPI.log("registered uid: "+uid);
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
    XAPI.chgUrl=function(url){
        window.location="#"+JSON.stringify(url);
    };
    $.getScript("api/js/p_world.js",function(){
        XAPI.log("World Page loaded");
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
})();

$(function () {
    $.getScript = function(j,s){
        jQuery.ajax({
            url: j,
            dataType: "script",
            cache: true
        }).done(function() {
            s && s();
        });
    };
    var intel;
    $('.dbd').mousedown(function () {
        if (!intel) {
            $(document).mouseup(function () {
                $(document).unbind("mouseup");
                if (intel) {
                    clearInterval(intel);
                    intel = 0;
                }
            });
            intel = setInterval(function () {
                window.scrollBy(0, -((window.scrollY / 100) + 1 < 30 ? (window.scrollY / 100) + 1 : 30));
            }, 1);
        }
    });
    function addClose() {
        $('.sucrf_close').css({display: "inline"}).animate({opacity: 1}, 200).click(function () {
            $('.sucrf').animate({opacity: 0, height: "0px"}, 300, function () {
                $('.sucrf').remove();
            });
            $('.sucrf_close').unbind('click');
        });
    }

    var ttl = setTimeout(function () {
        $('.sucrf').animate({opacity: 0, height: "0px"}, 1500, function () {
            $('.sucrf').remove();
        }).unbind('mousemove').mousemove(function () {
            $('.sucrf').stop(true, false, false).animate({opacity: 1, height: "50px"}, 150);
            addClose();
        });
    }, 3500);
    $('.sucrf').mousemove(function () {
        clearTimeout(ttl);
        addClose();
    });
    var urs=$('.usrlgned');
    urs.click(function(){
        (function(){
            var thi=this;
            $(".alertboxusrx").remove();
            var name=this.text();
            var uid=this.data("uid");
            console.info(name+" .uid="+uid);
            var alertbox=$('<div class="alertboxusr alertboxusrx"></div>');
            var headpicbox=$('<div class="headpicbox"></div>');
            headpicbox.append($('<img>').attr("src","/uid/"+uid+"/pic"));
            function process(c){
                headpicbox.remove();
                var lv=$('<div class="alewalt">请稍候</div>');
                alertbox.animate({width: "300px",height: "50px",left: $(window).width()-320,top: 50+(60*XLIB.chiJs)},250);
                XLIB.chiJs++;
                st.animate({opacity: 0},250,function(){
                    st.html("").append(lv);
                    st.animate({opacity: 1},250);
                    c(st);
                });
                st.find('*').unbind();
                alertbox.removeClass("alertboxusrx");
                return lv;
            }
            var st=$('<ul></ul>');
            alertbox.append(st);
            st.append($('<li></li>').text(name+" 的用户页").append($("<div class='opssn sjl'></div>").text("UID="+uid))
                .click(function(){
                    process(function(){
                        window.location.assign("/u/"+encodeURIComponent(name));
                    });
                }));
            st.append($('<li>设置</li>'));
            st.append($('<li>登出</li>').click(function(){
                process(function(st){
                    $.post("/usr/logout",{userid: uid,wisChk: pdWisChk},function(){
                        alertbox.animate({opacity: 0},250,function(){
                            alertbox.remove();
                        });
                        thi.animate({opacity: 0},250,function(){
                            thi.remove();
                        });
                    });
                });
            }));
            var thlc=this.offset();
            var ltp=thlc.left-60;
            alertbox.css({left: (ltp>$(window).width()-190?$(window).width()-190:ltp),top: thlc.top+25});
            $('body').append(alertbox).mousedown(function(e){
                if($(e.target).parents(".alertboxusr").length<1 && !$(e.target).hasClass("alertboxusr")){
                    $(".alertboxusrx").remove();
                    headpicbox.remove();
                }
            }).append(headpicbox);
            headpicbox.css({left: (ltp>$(window).width()-190?$(window).width()-190:ltp)-30,top: thlc.top+25+4});
        }).call($(this));
    });
    $('.lognplas, .lgonbt').attr("href","/login?redirect="+encodeURIComponent(window.location));
    var wlzdding=false;
    function checkInternet(){
        var ro=setTimeout(function(){
            setTimeout(checkInternet,150);
            if(wlzdding){
                return;
            }
            wlzdding=true;
            var bbc=$('<div class="winbox padding8"></div>');
            bbc.append($('<h2>网络已断开。</h2>'));
            bbc.append($('<p>请放心，您在编辑器中输入的内容都将自动保存。</p>'));
            bbc.append($('<p class="opsi">网络恢复后，此对话框将自动<button class="xui-buttom">关闭</button>。</p>'));
            bbc.find('button').click(function(){
                $('.wlzdd').animate({opacity: 0},180,function(){
                    $('.wlzdd').css({display:"none"});
                });
            });
            $('body').append($('<div class="bbgr wlzdd"></div>').css({opacity:0}).animate({opacity: 1},150).append(bbc));
        },1500);
        $.get('/dev/ping',function(j){
            if(j.ok=="OK"){
                if(wlzdding){
                    $('.wlzdd').animate({opacity: 0},180,function(){
                        $('.wlzdd').remove();
                        wlzdding=false;
                    });
                }
                clearTimeout(ro);
                setTimeout(checkInternet,4000);
            }
        },'json');
    }
    window.pagedata={};
    $('.pagedata').each(function(a,b){
        for(var i in b.dataset){
            var dd=b.dataset[i];
            pagedata[i]=dd;
        }
    });
    window.pdWisChk=pagedata.wisck;
    function doLUI(){
        var width=$(window).width();
        if(width<480){
            $('.dbd').addClass('lui-smailldbd');
            $('body').css({padding:"2px", minWidth: "250px"});
        }else{
            $('.dbd').removeClass('lui-smailldbd');
            $('body').css({padding:""});
        }
    }
    $(window).bind('resize', doLUI);
    doLUI();
});

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
            function process(c){
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
                }
            });
        }).call($(this));
    });
});
(function($){
    $.fn.markboxInit=function(){
        var manDoma=$('<div class="markBox"></div>');
        var xPrev=$('<div class="markBoxPrevx"></div>');
        manDoma.append(xPrev);
        var moBar=$('<div class="markBoxMobar"></div>');
        manDoma.append(moBar);
        var bout=$('<div class="markBoxEditOut"></div>');
        var ddMb=$('<span class="markBoxModdmb"></span>');
        moBar.append($('<b class="markBoxSelo">使用Markdown编辑</b>'));
        moBar.append(ddMb);
        ddMb.append($('<b class="markBoxBut">B</b>'));
        ddMb.append($('<i class="markBoxBut">I</i>'));
        ddMb.append($('<span class="markBoxBut">&lt;a</span>'));
        ddMb.append($('<span class="markBoxBut">"</span>'));
        ddMb.append($('<span class="markBoxBut">&lt;pre</span>'));
        ddMb.append($('<span class="markBoxBut">&lt;img</span>'));
        ddMb.append($('<span class="markBoxBut">&lt;ol</span>'));
        ddMb.append($('<span class="markBoxBut">&lt;ul</span>'));
        ddMb.append($('<b class="markBoxBut">&lt;h1</b>'));
        ddMb.append($('<b class="markBoxBut">&lt;h2</b>'));
        ddMb.append($('<span class="markBoxBut">--</span>'));
        var moBfar=$('<span class="markBoxFlort"></span>');
        moBar.append(moBfar);
        var tl=this;
        var prev=$('<span class="markBoxBut markBoxRevBtn">预览</span>');
        prev.click(function(){
            tl.preview(!tl.previewing);
        });
        moBfar.append(prev);
        moBfar.append($('<span class="markBoxBut">发布</span>'));
        var editBox=$('<textarea class="markBoxEdit" contenteditable="true"></textarea>');
        manDoma.append(bout);
        bout.append(editBox);
        this.previewing=false;
        var savint=setInterval(function(){
        },500);
        this.markboxFal=function(){
        };
        this.getMarkdownText=function(){
            return editBox.val();
        };
        this.preview=function(swi){
            if(swi){
                this.previewing=true;
                xPrev.html("Loading");
                xPrev.css({opacity: 1, padding: "8px"});
                xPrev.animate({height: "300px"}, 800);
                bout.animate({height: "0", margin: "0", padding: "0"}, 300);
                $.post('/@md/preview', {md: this.getMarkdownText()}, function (q) {
                    xPrev.html(q.preview);
                    if (q.error) {
                        xPrev.append($('<div class="wigWitherror"></div>').text(q.error));
                    }
                    XLIB.reflashLight();
                }, 'json');
                prev.addClass("markBoxRevHowedBtn");
                ddMb.css({display: "none"});
            }else{
                this.previewing=false;
                xPrev.animate({height: 0, opacity: 0}, 800, function(){
                    xPrev.html("");
                });
                setTimeout(function(){
                    xPrev.animate({padding: 0}, 100);
                },700);
                bout.css({height: "", opacity:0});
                bout.animate({padding: "4px", margin: "8px", opacity: 1}, 300);
                ddMb.css({display: ""});
                prev.removeClass("markBoxRevHowedBtn");
            }
        };
        this.append(manDoma);
    };
})(jQuery);
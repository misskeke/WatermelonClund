(function($){
    $.fn.markboxInit=function(d){
        var manDoma=$('<div class="markBox"></div>');
        var xPrev=$('<div class="markBoxPrevx m"></div>');
        manDoma.append(xPrev);
        var moBar=$('<div class="markBoxMobar">&nbsp;</div>');
        var lastDfd="";
        manDoma.append(moBar);
        var bout=$('<div class="markBoxEditOut"></div>');
        var ddMb=$('<span class="markBoxModdmb"></span>');
        var mduse=$('<b class="markBoxSelo">使用Markdown编辑</b>');
        moBar.append(mduse);
        moBar.append(ddMb);
        ddMb.append($('<b class="markBoxBut oiii">B</b>').click(function(){
            selection("**"+seldef("粗体文字")+"**");
        }));
        ddMb.append($('<i class="markBoxBut oiii">I</i>').click(function(){
            selection("*"+seldef("斜体文字")+"*");
        }));
        ddMb.append($('<span class="markBoxBut oiii">&lt;a</span>').click(function(){
            selection("["+seldef("链接文本")+"](链接)");
        }));
        ddMb.append($('<span class="markBoxBut oiii">"</span>').click(function(){
            var str=seldef("////");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+="> "+lines[i]+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<span class="markBoxBut oii">&lt;pre</span>').click(function(){
            var str=seldef("console.info('Hello World');");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+="    "+lines[i]+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<span class="markBoxBut oii">&lt;`code`加行号</span>').click(function(){
            var str=seldef("console.info('Hello World');");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+="0. "+(lines[i].trim().length>0?"`"+lines[i]+"`":"   ")+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<span class="markBoxBut oii">&lt;img</span>').click(function(){
            selection("!["+seldef("图片名称")+"](图片链接)");
        }));
        ddMb.append($('<span class="markBoxBut oii">&lt;ol</span>').click(function(){
            var str=seldef("第一项");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+=(i+1)+". "+lines[i]+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<span class="markBoxBut oii">&lt;ul</span>').click(function(){
            var str=seldef("第一项");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+="* "+lines[i]+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<b class="markBoxBut oii">&lt;h1</b>').click(function(){
            selection("\n# "+seldef("xxx")+"\n");
        }));
        ddMb.append($('<b class="markBoxBut oii">&lt;h2</b>').click(function(){
            selection("\n## "+seldef("xxx")+"\n");
        }));
        ddMb.append($('<span class="markBoxBut oii">--</span>').click(function(){
            selection("\n---\n");
        }));
        ddMb.append($('<span class="markBoxBut oii">撤销</span>').click(function(){
            if(lastDfd.length>0){
                var dx=editBox.val();
                editBox.val(lastDfd);
                lastDfd=dx;
            }
        }));
        var pp=$('<span class="markBoxBut">传图</span>');
        ddMb.append(pp);
        var ddat=$('<span class="markBoxBut oii">附件</span>');
        ddMb.append(ddat);
        var adddoc=$('<span class="markBoxBut">帮助·提示</span>').click(function(){
            window.open("https://websint.org/markdown/helptips");
        });
        moBar.append(adddoc);
        var moBfar=$('<span class="markBoxFlort"></span>');
        moBar.append(moBfar);
        var tl=this;
        var prev=$('<span class="markBoxBut markBoxRevBtn">预览</span>');
        prev.click(function(){
            tl.preview(!tl.previewing);
        });
        moBfar.append(prev);
        var submitBtn=$('<span class="markBoxBut">发布</span>');
        moBfar.append(submitBtn);
        var editBox=$('<textarea class="markBoxEdit" contenteditable="true"></textarea>');
        manDoma.append(bout);
        bout.append(editBox);
        this.previewing=false;
        if(localStorage["cvg"+d]){
            editBox.val(localStorage["cvg"+d]);
        }
        var lahei=0;
        var savint=setInterval(function(){
            localStorage["cvg"+d]=tl.getMarkdownText();
            // var linenum=tl.getMarkdownText().split('\n').length+1;
            // var height=linenum * 24;
            // height = height.toString()+"px";\
            var dmy=$('<div class="markBoxEdit"></div>');
            var mdteee=$('<span>').text(tl.getMarkdownText()).html().replace(/\n/g,'<br>');
            dmy.html(mdteee);
            $('body').append(dmy);
            dmy.css({height: "auto", width: editBox.width()+"px"});
            var height=dmy.height()+40;
            console.info(height);
            dmy.remove();
            if(height!=lahei){
                editBox.stop(true,false,false).animate({height: height},150);
                lahei=height;
            }
        },150);
        var sav2=true;
        function dcc(){
            var mbo=parseInt(moBar.offset().top)-(parseInt(moBar.css("top")) || 0);
            moBar.css({top:(Math.max(0-(mbo-window.scrollY-50),0) || Math.min(0-(mbo-window.scrollY-$(window).height()+29),0))+"px"});
            var wid=$(document).width();
            if(wid<1048){
                ddMb.find('.oii').css({display:"none"});
            }else{
                ddMb.find('.oii').css({display: ""});
            }
            if(wid<560){
                mduse.css({display: "none"});
            }else{
                mduse.css({display:""});
            }
            if(wid<480){
                manDoma.css({margin: "", border: ""});
                var mar=manDoma.offset().left;
                var widtt=manDoma.width();
                manDoma.css({marginLeft: "-"+mar+"px", border: "hidden", marginRight: (wid-widtt-40-2)+"px"});
            }else{
                manDoma.css({margin: "", border: ""});
            }
            if(wid<420){
                adddoc.css({display: "none"});
            }else{
                adddoc.css({display: ""});
            }
            if(wid<340){
                ddMb.find('.oiii').css({display:"none"});
            }else{
                ddMb.find('.oiii').css({display: ""});
            }
            if(sav2){
                ((requestAnimationFrame || webkitRequestAnimationFrame) || setTimeout)(dcc);
            }
        }
        setTimeout(function(){
            dcc();
        },300);
        var lastState=true;
        var selint=setInterval(function(){
            if(selection().length>0 && !lastState){
                lastState=true;
                ddMb.stop(true,false,false).animate({backgroundColor: "rgba(255, 255, 255, 0.16)", opacity:1},200);
            }else if(selection().length==0 && lastState){
                lastState=false;
                ddMb.stop(true,false,false).animate({backgroundColor: "rgba(255, 255, 255, 0)", opacity: 0.9},200);
            }
        },50);
        this.markboxFal=function(){
            clearInterval(savint);
            clearInterval(selint);
            sav2=false;
            moBar.animate({right: "-100%"},350,function(){
                tl.remove();
            });
            manDoma.animate({opacity: "0"},350);
        };
        this.getMarkdownText=function(){
            return editBox.val();
        };
        this.setMarkdownText=function(q,e){
            if(e){
                if(this.getMarkdownText().trim().length<1){
                    return editBox.val(q);
                }
                return;
            }
            return editBox.val(q);
        };
        this.setSubmit=function(st){
            if(typeof st == "string" && st.length<1){
                submitBtn.css({display:"none"});
            }else{
                submitBtn.css({display:""});
            }
            return submitBtn.text(st);
        };
        this.submCilck=function(t){
            submitBtn.click(t);
        };
        this.submunbind=function(a,b,c){
            submitBtn.unbind(a,b,c);
        };
        this.preview=function(swi){
            if(swi && !this.previewing){
                this.previewing=true;
                xPrev.html("");
                var m=XLIB.mbm("正在预览……");
                $.post('/@md/preview', {md: this.getMarkdownText()}, function (q) {
                    moBar.animate({backgroundColor:"#2E2F3B"},450);
                    m.ok();
                    xPrev.html(q.preview);
                    if (q.error) {
                        xPrev.append($('<div class="wigWitherror"></div>').text(q.error));
                    }
                    xPrev.css({height:"auto"});
                    var xHigh=xPrev.height();
                    xPrev.css({height:"0"});
                    xPrev.css({opacity: 1, padding: "8px"});
                    xPrev.animate({height: xHigh+20},450);
                    bout.animate({height: "15px", margin: "0", padding: "0"}, 450);
                    XLIB.reflashLight();
                }, 'json');
                prev.addClass("markBoxRevHowedBtn");
                ddMb.animate({height: "0"}, 450, function(){
                    ddMb.css({display: "none",height:""});
                    adddoc.css({marginLeft:"617px"}).animate({marginLeft:"1px"},450);
                });
            }else if(!swi && this.previewing){
                this.previewing=false;
                moBar.animate({backgroundColor:"#3F2E36"},450);
                xPrev.animate({height: 0, opacity: 0, padding: 0}, 450, function(){
                    adddoc.css({marginLeft:"1px"}).animate({marginLeft:"617px"},450,function(){
                        ddMb.css({display: ""});
                        adddoc.css({marginLeft:"1px"});
                        var ddmbheight=ddMb.height();
                        ddMb.css({height:0}).animate({height: ddmbheight},450);
                    });
                    xPrev.html("");
                });
                bout.css({height: "", opacity:1});
                var bouthigh=bout.height();
                bout.css({height:0});
                bout.animate({padding: "4px", margin: "8px", opacity: 1, height:bouthigh}, 450, function(){
                    bout.css({height:""});
                });
                prev.removeClass("markBoxRevHowedBtn");
            }
        };
        function selection(a){
            var ddt=editBox[0];
            if(a){
                lastDfd=editBox.val();
            }
            if(document.selection != undefined){
                var sel = document.selection.createRange();
                if(a){
                    sel.text=a;
                }
                return sel.text;
            }else if(ddt.selectionStart != undefined){
                if(a){
                    editBox.val(editBox.val().substring(0,ddt.selectionStart)+a+editBox.val().substring(ddt.selectionEnd));
                }
                return editBox.val().substring(ddt.selectionStart,ddt.selectionEnd);
            }
        }
        function seldef(def){
            var se=selection();
            if(se.length>0){
                return se;
            }else{
                return def;
            }
        }
        $([moBar,xPrev]).bind("focus selectstart select mousedown mouseup",function(e){
            e.preventDefault();
            return false;
        });
        editBox.focus(function(){
            tl.preview(false);
        });
        this.append(manDoma);

        moBar.animate({right: "0"},350, function(){
            moBar.animate({backgroundColor:"#3F2E36"},450);
        });
        manDoma.animate({opacity: "1"},350);

        $.getScript("/j/fileupd.js",function(){
            pp.click(function(){
                XLIB.showFileUpd(function(fids,fnames){
                    var bff="";
                    for(var i=0;i<fids.length;i++){
                        bff+="!["+fnames[i]+"](/f/"+fids[i]+")\n";
                    }
                    selection(bff);
                });
            });
            ddat.click(function(){
                XLIB.showFileUpd(function(fids,fnames){
                    var bff="";
                    for(var i=0;i<fids.length;i++){
                        bff+="[下载 "+fnames[i]+"](/f/"+fids[i]+")\n";
                    }
                    selection(bff);
                });
            });
        });
        editBox.keydown(function(e){
            var ddt=editBox[0];
            console.info(e);
            if(e.keyCode == 9){
                e.preventDefault();
                var ss=ddt.selectionStart;
                var ee=ddt.selectionEnd;
                var pd=seldef("");
                if(pd.length>0){
                    var mdt=tl.getMarkdownText();
                    var selctstart=Math.max(0,mdt.substr(0,ss).lastIndexOf("\n"));
                    var selctend=Math.max(0,mdt.substr(ee).indexOf("\n")-1+ee);
                    var selt=mdt.substring(selctstart,selctend);
                    var replacment=(e.shiftKey?selt.replace(/\n\t/g,"\n"):selt.replace(/\n/g,"\n\t"));
                    console.info(selt,mdt,replacment,ss,ee,selctstart,selctend);
                    var rpm=(selctstart==0?"\t":"")+replacment;
                    tl.setMarkdownText(mdt.substr(0,selctstart)+rpm+mdt.substr(selctend));
                    ddt.setSelectionRange(selctstart+1,rpm.length);
                }else{
                    selection("\t");
                    ddt.setSelectionRange(ss+1,ss+1);
                }
            }else if(e.keyCode == 13){
                if(ddt.selectionStart != undefined){
                    e.preventDefault();
                    var v=tl.getMarkdownText();
                    var ss=ddt.selectionStart;
                    v=v.substr(0,ddt.selectionStart);
                    v=v.substr(v.lastIndexOf("\n")+1);
                    var ppt;
                    if(v.match(/^\d+\./)){
                        ppt="\n"+(parseInt(v.match(/^\d+/)[0])+1).toString()+". ";
                    }else if(v.match(/^\*/)){
                        ppt="\n* ";
                    }else if(v.match(/^(\>\s*)+/)){
                        ppt="\n"+v.match(/^(\>\s*)+/)[0];
                    }else{
                        ppt="\n"+v.match(/^\s{0,}/)[0];
                    }
                    selection(ppt);
                    ddt.setSelectionRange(ss+ppt.length,ss+ppt.length);
                }
            }
        });
        return this;
    };
})(jQuery);

(function($){
    $.fn.markboxInit=function(d){
        var manDoma=$('<div class="markBox"></div>');
        var xPrev=$('<div class="markBoxPrevx m"></div>');
        manDoma.append(xPrev);
        var moBar=$('<div class="markBoxMobar"></div>');
        var lastDfd="";
        manDoma.append(moBar);
        var bout=$('<div class="markBoxEditOut"></div>');
        var ddMb=$('<span class="markBoxModdmb"></span>');
        moBar.append($('<b class="markBoxSelo">使用Markdown编辑</b>'));
        moBar.append(ddMb);
        ddMb.append($('<b class="markBoxBut">B</b>').click(function(){
            selection("**"+seldef("粗体文字")+"**");
        }));
        ddMb.append($('<i class="markBoxBut">I</i>').click(function(){
            selection("*"+seldef("斜体文字")+"*");
        }));
        ddMb.append($('<span class="markBoxBut">&lt;a</span>').click(function(){
            selection("["+seldef("链接文本")+"](链接)");
        }));
        ddMb.append($('<span class="markBoxBut">"</span>').click(function(){
            var str=seldef("////");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+="> "+lines[i]+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<span class="markBoxBut">&lt;pre</span>').click(function(){
            var str=seldef("console.info('Hello World');");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+="    "+lines[i]+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<span class="markBoxBut">&lt;`code`加行号</span>').click(function(){
            var str=seldef("console.info('Hello World');");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+="0. "+(lines[i].trim().length>0?"`"+lines[i]+"`":"   ")+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<span class="markBoxBut">&lt;img</span>').click(function(){
            selection("!["+seldef("图片名称")+"](图片链接)");
        }));
        ddMb.append($('<span class="markBoxBut">&lt;ol</span>').click(function(){
            var str=seldef("第一项");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+=(i+1)+". "+lines[i]+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<span class="markBoxBut">&lt;ul</span>').click(function(){
            var str=seldef("第一项");
            var buf="";
            var lines=str.split("\n");
            for(var i=0;i<lines.length;i++){
                buf+="* "+lines[i]+"\n";
            }
            selection("\n"+buf);
        }));
        ddMb.append($('<b class="markBoxBut">&lt;h1</b>').click(function(){
            selection("\n# "+seldef("xxx")+"\n");
        }));
        ddMb.append($('<b class="markBoxBut">&lt;h2</b>').click(function(){
            selection("\n## "+seldef("xxx")+"\n");
        }));
        ddMb.append($('<span class="markBoxBut">--</span>').click(function(){
            selection("\n---\n");
        }));
        ddMb.append($('<span class="markBoxBut">撤销</span>').click(function(){
            if(lastDfd.length>0){
                var dx=editBox.val();
                editBox.val(lastDfd);
                lastDfd=dx;
            }
        }));
        var pp=$('<span class="markBoxBut">传图</span>');
        ddMb.append(pp);
        var ddat=$('<span class="markBoxBut">附件</span>');
        ddMb.append(ddat);
        moBar.append($('<span class="markBoxBut">帮助·提示</span>').click(function(){
            window.open("https://websint.org/markdown/helptips");
        }));
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
        var savint=setInterval(function(){
            localStorage["cvg"+d]=tl.getMarkdownText();
            var linenum=tl.getMarkdownText().split('\n').length+1;
            var height=linenum * 24;
            height = height.toString()+"px";
            editBox.stop(true,false,false).animate({height: height},150);
        },150);
        var lastState=true;
        var selint=setInterval(function(){
            if(selection().length>0 && !lastState){
                lastState=true;
                ddMb.stop(true,false,false).animate({backgroundColor: "rgba(255, 255, 255, 0.16)", opacity:1},200);
            }else if(selection().length==0 && lastState){
                lastState=false;
                ddMb.stop(true,false,false).animate({backgroundColor: "rgba(255, 255, 255, 0)", opacity: 0.9},200);
            }
        },1);
        this.markboxFal=function(){
            clearInterval(savint);
            clearInterval(selint);
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
                xPrev.html("Loading");
                xPrev.css({opacity: 1, padding: "8px"});
                xPrev.animate({height: editBox.height()*2}, 450);
                bout.animate({height: "15px", margin: "0", padding: "0"}, 450);
                $.post('/@md/preview', {md: this.getMarkdownText()}, function (q) {
                    xPrev.html(q.preview);
                    if (q.error) {
                        xPrev.append($('<div class="wigWitherror"></div>').text(q.error));
                    }
                    XLIB.reflashLight();
                }, 'json');
                prev.addClass("markBoxRevHowedBtn");
                ddMb.css({display: "none"});
            }else if(!swi && this.previewing){
                this.previewing=false;
                xPrev.animate({height: 0, opacity: 0}, 450, function(){
                    xPrev.html("");
                    ddMb.css({display: ""});
                });
                setTimeout(function(){
                    xPrev.animate({padding: 0}, 100);
                },700);
                bout.css({height: "", opacity:1});
                bout.animate({padding: "4px", margin: "8px", opacity: 1}, 450);
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

        moBar.animate({right: "0"},350);
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

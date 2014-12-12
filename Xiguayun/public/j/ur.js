$(function(){
    if(hasPrem){
        XLIB.centEditCf($('.sex'),function(){
            var bc=XLIB.mbm("保存……");
            $.post("/usetx/"+xgrid,{wisChk: pdWisChk, sex: $('.sex').text()},function(q){
                if(!q.error){
                    bc.ok();
                }else{
                    bc.text("失败……"+ q.error);
                    bc.closeTimeout(1500);
                    $('.sex').text(q.unsc).earmcet();
                }
            },'json');
        });
        XLIB.centEditCf($('.sign'),function(){
            var bc=XLIB.mbm("保存……");
            $.post("/usetx/"+xgrid,{wisChk: pdWisChk, sign: $('.sign').text()},function(q){
                if(!q.error){
                    bc.ok();
                }else{
                    bc.text("失败……"+ q.error);
                    bc.closeTimeout(1500);
                    $('.sign').text(q.unsc).earmcet();
                }
            },'json');
        });
        var welh=$('.weleditableneedhidden');
        var markboxload=false;
        var editweling=false;
        welh.click(function(){
            var kkd='usr:'+xgrid+'.weledit';
            if(!editweling){
                editweling=true;
                welh.animate({opacity: 0, height: 0},300,function(){
                    welh.css({display:"none"});
                });
                function ddr(){
                    var tdbox=$('<div></div>');
                    welh.before(tdbox);
                    tdbox.markboxInit(kkd);
                    $.get('/ux/'+xgrid+'/welcomeuserpage',function(q){
                        if(localStorage["cvg"+kkd]){
                            tdbox.setMarkdownText(localStorage["cvg"+kkd]);
                        }else{
                            tdbox.setMarkdownText(q.val);
                        }
                    });
                    tdbox.submCilck(function(){
                        var nt=tdbox.getMarkdownText();
                        var bc=XLIB.mbm("保存……");
                        $.post("/usetx/"+xgrid,{wisChk: pdWisChk, welcomeuserpage: nt},function(q){
                            if(!q.error){
                                bc.ok();
                                tdbox.markboxFal();
                                setTimeout(function(){
                                    welh.html(q.rended);
                                    welh.css({display:"", height: ""});
                                    welh.animate({opacity: 1},300,function(){
                                        editweling=false;
                                        delete localStorage["cvg"+kkd];
                                    });
                                },350);
                            }else{
                                bc.text("失败……"+ q.error);
                                bc.closeTimeout(1500);
                            }
                        },'json');
                    });
                }
                if(!markboxload){
                    $('<link/>', {
                        rel: 'stylesheet',
                        type: 'text/css',
                        href: '/s/mb.css'
                    }).appendTo('head');
                    $.getScript('/j/markbox.js',function(){
                        markboxload=true;
                        ddr();
                    });
                }else{
                    ddr();
                }
            }
        });
        function metProc(procname,newname,val,failt){
            if(newname.length<1 || val.length<1){
                var bc=XLIB.mbm("保存……");
                $.post("/usetx/"+xgrid,{wisChk: pdWisChk, iName: procname, iUnset: 1},function(q){
                    if(!q.error){
                        bc.ok();
                    }else{
                        bc.text("失败……"+ q.error);
                        bc.closeTimeout(1500);
                        failt();
                    }
                },'json');
            }else if(newname==procname){
                var bc=XLIB.mbm("保存……");
                $.post("/usetx/"+xgrid,{wisChk: pdWisChk, iName: procname, iVal: val},function(q){
                    if(!q.error){
                        bc.ok();
                    }else{
                        bc.text("失败……"+ q.error);
                        bc.closeTimeout(1500);
                        failt();
                    }
                },'json');
            }else if(newname!=procname){
                var bc=XLIB.mbm("保存……");
                $.post("/usetx/"+xgrid,{wisChk: pdWisChk, iName: procname, iRename: newname},function(q){
                    if(!q.error){
                        bc.ok();
                    }else{
                        bc.text("失败……"+ q.error);
                        bc.closeTimeout(1500);
                        failt();
                    }
                },'json');
            }
        }
        function gged(tr){
            var tdp=tr.children('.proc');
            var tdv=tr.children('.valu');
            tdp.addClass('editable');
            tdv.addClass('editable');
            XLIB.centEditCf(tdp,function(odt){
                if(tdp.text().length<1){
                    tr.remove();
                }
                metProc(odt,tdp.text(),tdv.text(),function(){
                    tdv.mousedown();
                });
            });
            XLIB.centEditCf(tdv,function(){
                if(tdv.text().length<1){
                    tr.remove();
                }
                metProc(tdp.text(),tdp.text(),tdv.text(),function(){
                    tdv.mousedown();
                });
            });
        }
        var tp=$('.usper');
        var rds=tp.children('.tit');
        for(var i=0;i<rds.length;i++){
            gged($(rds[i]));
        }
        var um=$('.umore').click(function(){
            um.css({display: "none"});
            var ta=$('<tr></tr>');
            var xxname=$('<td class="editable"></td>');
            XLIB.centEditCf(xxname,function(){
                var proname=xxname.text();
                var pp=$('<td class="proc"></td>');
                pp.text(proname);
                if(proname.length<1){
                    ta.remove();
                    um.css({display: ""});
                    return;
                }
                xxname.remove();
                ta.append(pp);
                var da=$('<td class="editable"></td>');
                ta.append(da);
                XLIB.centEditCf(da,function(){
                    var proval=da.text();
                    var pa=$('<td class="valu"></td>');
                    pa.text(proval);
                    if(proval.length<1){
                        ta.remove();
                        um.css({display: ""});
                        return;
                    }
                    da.remove();
                    ta.append(pa);
                    gged(ta);
                    metProc(proname,proname,proval,function(){
                        ta.remove();
                    });
                    um.css({display: ""});
                });
                da.mousedown();
            });
            ta.append(xxname);
            xxname.mousedown();
            um.after(ta);
        });
    }
});

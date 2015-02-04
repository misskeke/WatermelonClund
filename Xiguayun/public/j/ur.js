$(function(){
    var hasPrem=pagedata.hasOwnProperty("hasprem");
    var xgrn=pagedata.xgrn;
    var xgrid=pagedata.xgrid;
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
            var bc=XLIB.mbm("保存……保存");
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
                    XLIB.getS('/j/markbox.js',function(){
                        markboxload=true;
                        ddr();
                    });
                }else{
                    ddr();
                }
            }
        });
        function metProc(procname,newname,val,failt,ok){
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
                    ok?ok():0;
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
                    ok?ok():0;
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
                    ok?ok():0;
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
        var lttc=$('.loadppc');
        var cl=$('.clear');
        lttc.click(function(){
            var confirm=$('<button class="xui-buttom">确定</button>');
            var no=$('<button class="xui-buttom">取消</button>');
            var xx=$('<div></div>').append(confirm);
            lttc.before(xx);
            confirm.before($('<div style="height: 40px; line-height: 40px;">确定？</div>'));
            confirm.after(no);
            no.click(function(){
                xx.remove();
                lttc.css({display: "block"});
            });
            confirm.click(function(){
                $('.u-xx').remove();
                var bc=XLIB.mbm("应用模板中……");
                function addps(p,v,ok){
                    metProc(p,p,v,function(){
                        XLIB.mbm(p+"：失败。");
                    },ok);
                }
                var tps=[
                    {"攻受":"受"},
                    {"学历":"初中"},
                    {"在线时间":"由于学业原因每天很少/没有。"},
                    {"编程":"不会"},
                    {"QQ":"10000"},
                    {"Email":"someone@gmail.com"},
                    {"网址":"blogs.websint.org/"+xgrn},
                    {"翻墙":"已翻，手段=IPv6 + vpn"},
                    {"生日":"1-01"},
                    {"作息时间":"星期1~5： 睡觉=23:00 起床=7:00 放假/星期6~7： 睡觉=+2:00 起床=11:00"},
                    {"赶紧开始吧！":"点击这里编辑，加上更多有趣的信息，或者点击这里编辑并清空以删除此栏。"}
                ];
                function gcr(i){
                    console.info(i,tps.length);
                    if(i>=tps.length){
                        XLIB.mbm("完成……");
                        setTimeout(function(){
                            window.location.reload();
                        },800);
                        return;
                    }
                    var obj=tps[i];
                    var t=i;
                    for(var i in obj){
                        if(obj.hasOwnProperty(i)){
                            addps(i,obj[i],function(){
                                gcr(t+1);
                            });
                            break;
                        }
                    }
                }
                gcr(0);
            });
            lttc.css({display: "none"});
        });
        cl.click(function(){
            var confirm=$('<button class="xui-buttom">确定</button>');
            var no=$('<button class="xui-buttom">取消</button>');
            var xx=$('<div></div>').append(confirm);
            cl.before(xx);
            confirm.before($('<div style="height: 40px; line-height: 40px;">确定？</div>'));
            confirm.after(no);
            no.click(function(){
                xx.remove();
                cl.css({display: "block"});
            });
            confirm.click(function(){
                var bc=XLIB.mbm("清空中……");
                function addps(p,v,ok){
                    metProc(p,p,v,function(){
                        XLIB.mbm(p+"：失败。");
                    },ok);
                }
                var lts=$('.usper').children('.tit');
                var bjs=[];
                for(var i=0;i<lts.length;i++){
                    bjs.push($(lts[i]).children('.proc').text());
                }
                $('.u-xx').remove();
                function gcr(i){
                    if(i>=bjs.length){
                        XLIB.mbm("完成……");
                        setTimeout(function(){
                            window.location.reload();
                        },800);
                        return;
                    }
                    var obj=bjs[i];
                    addps(obj,"",function(){
                        gcr(i+1);
                    });
                }
                gcr(0);
            });
            cl.css({display: "none"});
        });
        $('.hpic').css({cursor:"pointer"}).click(function(){
            window.location.assign("/uid/"+xgrid+"/picset");
        });
    }
});

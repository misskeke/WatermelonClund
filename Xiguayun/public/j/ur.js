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
    }
});
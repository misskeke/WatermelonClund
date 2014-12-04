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
    }
});
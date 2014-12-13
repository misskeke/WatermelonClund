$(function(){
    var hps=$('.hp-sel');
    var xxp=$('.xx-fpm');
    for(var i=0;i<hps.length;i++){
        (function(hp){
            hp.css({cursor:"pointer"}).click(function(){
                $.post('/ux/'+xgrid+"/setPic",{pid: hp.data('hpid'), text: "", wisChk: pdWisChk}, function(){
                    xxp.text('完成');
                    window.location.reload();
                });
            });
        })($(hps[i]));
    }
    $('.rmall').click(function(){
        $.post('/ux/'+xgrid+'/rmallPic',{wisChk: pdWisChk}, function(){
            window.location.reload();
        });
    });
    $('.updbtn').click(function(){
        XLIB.showFileUpd(function(q,r){
            function doe(i){
                if(i>=q.length){
                    window.location.reload();
                    return;
                }
                $.post('/ux/'+xgrid+"/setPic",{pid: q[i], text: "", wisChk: pdWisChk}, function(){
                    xxp.text(r[i]+' 完成');
                    doe(i+1);
                });
            }
            doe(0);
        });
    });
});

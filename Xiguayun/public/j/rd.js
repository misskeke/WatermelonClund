$(function () {
    var vc=$('.rgitcxd');
    XLIB.wcAddErrtestAutoNo(vc);
    $('.go').click(function(){
        $('.go').attr('disabled',"true");
        $.post("/register/doConfirm",{code: vc.val(), wisChk: pdWisChk},function(q){
            if(q.error){
                $('.go').removeAttr('disabled');
                XLIB.wcAddErrtest(vc, q.error);
            }else{
                window.location.assign("/register/3");
            }
        },'json');
    });
});
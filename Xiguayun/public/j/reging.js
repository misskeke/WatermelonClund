$(function () {
    var vc=$('.rgivcd');
    XLIB.wcAddErrtestAutoNo(vc);
    $('.sud').click(function () {
        $('rgtsubmit').attr('disabled',"true");
        $('.sucrf_undo').remove();
        $('.sucrf').text("正在撤销…");
        $.post("/register/undoTask", {wisChk: pdWisChk}, function (q) {
            if (q.error == 0) {
                location.assign("/register");
            } else {
                $('.sucrf').text("撤销失败。刷新页面以重试。");
            }
        }, 'json');
    });
    $('.vcd_gennew').click(function(){
        $.post('/dev/fatchVcode/new', {wisChk: pdWisChk}, function(q){
            if(q.error==0){
                $('.vcd_img').attr("src","").attr("src","/dev/fatchVcode?"+parseInt(Math.random()*50000))[0].reload();
            }
        })
    });
    $('.rgtsubmit').click(function(){
        $('.rgtsubmit').attr('disabled',"true");
        $.post("/register/doConfirm",{vcode: vc.val(), wisChk: pdWisChk},function(q){
            if(q.error){
                $('.rgtsubmit').removeAttr('disabled');
                XLIB.wcAddErrtest(vc, q.error);
            }
        },'json');
    });
});
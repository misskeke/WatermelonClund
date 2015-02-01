$(function(){
    var fname=pagedata.fname;
    var rn=$('.rename');
    XLIB.centEditCf(rn, function(){
        XLIB.mbm('...');
        window.location.assign("/d/"+encodeURIComponent(rn.text())+"/create");
    });
    $('.di').markboxInit("ctb-"+fname).setSubmit("");
    $('.create').click(function(){
        var tjing=XLIB.mbm('正在提交……');
        $.post('/d/'+fname+'/docreate',{wisChk: pdWisChk}, function(q){
            if(q.error){
                tjing.text(q.error);
                tjing.closeTimeout(3000);
            }
        });
    });
});

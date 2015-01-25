$(function(){
    var fname=pagedata.fname;
    var rn=$('.rename');
    XLIB.centEditCf(rn, function(){
        XLIB.mbm('...');
        window.location.assign("/d/"+encodeURIComponent(rn.text())+"/create");
    });
    $('.di').markboxInit("ctb-"+fname).setSubmit("");
    $('.create').click(function(){
        XLIB.mbm('正在提交……');
        $.post('/d/'+fname+'/docreate',{wisChk: pdWisChk}, function(q){});
    });
});

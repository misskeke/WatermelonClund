$(function(){
    var fname=pagedata.fname;
    var rn=$('.rename');
    XLIB.centEditCf(rn, function(){
        XLIB.mbm('...');
        window.location.assign("/d/"+encodeURIComponent(rn.text())+"/create");
    });
});

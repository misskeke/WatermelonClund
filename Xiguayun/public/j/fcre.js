$(function(){
    var fname=$('.pagedata').data("fname");
    $('.rename').click(function(){
        var ta=$('<span class="editable"></span>');
        $('h1').html('创建&nbsp;').append(ta);
        XLIB.centEditCf(ta,function(){
            window.location.assign("/d/"+encodeURIComponent(ta.text())+"/create");
        });
        ta.text(fname);
        ta.mousedown();
    });
});

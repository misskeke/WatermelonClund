$(function(){
    var showing=false;
    XLIB.showFileUpd=function(callb){
        if(showing)
            return;
        showing=true;
        var bdy=$('body');
        var man=$('<div class="winbox padding8"></div>');
        bdy.append(man);
        man.append($('<h2>上传文件</h2>'));
        var appe=$('<div class="border1 center padding8">拖动文件到此处</div>');
        man.append(appe);
        var filebtn=$('<button class="xui-buttom margin8 padding8 lineheight12 height30">选择文件</button>');
        appe.append(filebtn);
        var fbox=$('<input type="file">');
        filebtn.click(function(){
            fbox.click();
        });
    }
});

XAPI.user.updateImage=function(callback,multiple){
    var bpdbox=$('<div style="position: fixed; z-index: 99998; text-align: center; left: 8px; right: 8px; top: 8px; bottom: 8px; background-color: #ffffff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);">' +
        '</div>');
    $('body').append(bpdbox);
    bpdbox.append($('<div style="font-size: 400%; padding: 16px;" class="iconfont">&#xe608;</div>'));
    bpdbox.append($('<div>请在下面选择文件或者拖动文件到下面的选择框中。</div>'));
    var cancel=XAPI.ui.createDBotton("取消");
    var hcal=$("<div></div>").append(cancel);
    bpdbox.append(hcal);
    cancel.click(function(){
        bpdbox.animate({opacity:0},250,function(){
            bpdbox.remove();
        });
    });
    var iptf=$('<input type="file" style="width: 600px;">');
    if(multiple){
        iptf.attr("multiple","true");
    }else{
        iptf.attr("single","true");
    }
    var filesBpre=$('<div style="overflow-y: auto; max-height: 50%; max-width: 800px; text-align: center; margin-left: auto; margin-right: auto;"></div>');
    bpdbox.append(filesBpre);
    iptf.bind("change",function(){
        hcal.remove();
        var f=iptf[0].files;
        iptf.remove();
        var pids=[];
        var fileacunt=f.length;
        function ck(){
            if(pids.length>=fileacunt){
                ck=null;
                callback(pids);
                setTimeout(function(){
                    bpdbox.animate({opacity:0},250,function(){
                        bpdbox.remove();
                    });
                },500);
            }
        }
        for(var i=0;i< f.length;i++){
            (function(fl){
                var fpre=$('<div style="background-color: #dddddd; width: 100%;"></div>');
                fpre.text(fl.name+" 正在读取");
                filesBpre.append(fpre);
                var reader = new FileReader();
                reader.onload = function(e){
                    var url=this.result;
                    fpre.text(fl.name+" 正在上传");
                    fpre.stop(true,false,false).animate({backgroundColor:"#58B5FC"},5000);
                    XAPI.send("api/updata_img.php",{src:url},function(q){
                        if(q.errid!=0){
                            fpre.stop(true,false,false).animate({backgroundColor:"#FE6D57"},150);
                            fpre.text(fl.name+" 失败: "+ q.errmsg);
                            pids.push(0);
                            ck();
                        }else{
                            fpre.stop(true,false,false).animate({backgroundColor:"#57FD5D"},150);
                            fpre.text(fl.name+" 成功");
                            pids.push(q.picid);
                            ck();
                        }
                    });
                };
                reader.readAsDataURL(fl);
            })(f[i]);
        }
        iptf[0].value="";
    });
    bpdbox.append(iptf);
};
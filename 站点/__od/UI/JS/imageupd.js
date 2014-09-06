(function(){
    var dcer=null;
    var ddropping=false;
    var bspe=$('<div style="background-color: rgba(55, 157, 255, 0); position: fixed; z-index: 999999; left: 0; right: 0; top: 0; bottom: 0; pointer-events: none;" class="no_mirror"></div>');
    $('body').append(bspe);
    function ind(){
        if(dcer){
            bspe.stop(true,true,false).animate({backgroundColor:"rgba(55, 157, 255, 0.3)"},250);
        }else{
            bspe.stop(true,true,false).animate({backgroundColor:"rgba(255, 48, 19, 0.3)"},250);
        }
    }
    function oud(){
        if(dcer){
            bspe.stop(true,true,false).animate({backgroundColor:"rgba(55, 157, 255, 0)"},250);
        }else{
            bspe.stop(true,true,false).animate({backgroundColor:"rgba(255, 48, 19, 0)"},250);
        }
    }
    var laststat=false;
    setInterval(function(){
        if(laststat!=ddropping){
            if(ddropping){
                ind();
            }else{
                oud();
            }
            laststat=ddropping;
        }
    },50);
    var entacc=0;
    var outacc=0;
    function ci(){
        ddropping=(entacc>outacc);
        console.info(entacc,outacc);
    }
    $(document).on({
        dragleave:function(e){
            console.info(e);
            if(dcer){
                e.preventDefault();
                outacc++;
                ci();
            }
        },
        drop:function(e){
            e.preventDefault();
            outacc++;
            ci();
            if(dcer){
                dcer(e.originalEvent.dataTransfer.files);
            }
        },
        dragenter:function(e){
            console.info(e);
            if(dcer){
                e.preventDefault();
                entacc++;
                ci();
            }
        },
        dragover:function(e){
            if(dcer){
                e.preventDefault();
            }
        },
        mousemove:function(){
            outacc=0;
            entacc=0;
            ci();
        }
    });
    XAPI.user.updateImage=function(callback,multiple,f){
        var bpdbox=$('<div style="position: fixed; z-index: 99998; text-align: center; left: 8px; right: 8px; top: 8px; bottom: 8px; background-color: #ffffff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);">' +
            '</div>');
        $('body').append(bpdbox);
        bpdbox.append($('<div style="font-size: 400%; padding: 16px;" class="iconfont">&#xe608;</div>'));
        bpdbox.append($('<div>拖动一个文件到这里，或者点击选择文件</div>'));
        var upd=XAPI.ui.createDWiteBotton("选择文件").css({padding:"50px",paddingLeft:"150px",paddingRight:"150px",fontSize:"24px",fontFamily:"微软雅黑 light",color:"#3e3e3e"});
        bpdbox.append(upd);
        var cancel=XAPI.ui.createDBotton("取消");
        var hcal=$("<div></div>").append(cancel);
        bpdbox.append(hcal);
        cancel.click(function(){
            dcer=null;
            bpdbox.animate({opacity:0},250,function(){
                bpdbox.remove();
            });
        });
        var iptf=$('<input type="file" style="width: 600px; display: none;">');
        upd.click(function(){
            iptf.click();
        });
        if(multiple){
            iptf.attr("multiple","true");
        }else{
            iptf.attr("single","true");
        }
        var filesBpre=$('<div style="overflow-y: auto; max-height: 50%; max-width: 800px; text-align: center; margin-left: auto; margin-right: auto;"></div>');
        bpdbox.append(filesBpre);
        function ccst(t){
            if(t && t.length<1){
                return;
            }
            dcer=null;
            hcal.remove();
            var f=iptf[0].files;
            if(f.length<1 && t==null){
                return;
            }
            if(t){
                f=t;
            }
            iptf.remove();
            upd.remove();
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
                    },1000);
                }
            }
            function uy(fl){
                var fpre=$('<div style="background-color: #dddddd; width: 100%;"></div>');
                fpre.text(fl.name+" 正在读取");
                filesBpre.append(fpre);
                var reader = new FileReader();
                if(fl.size>10*1024*1024){
                    fpre.stop(true,false,false).animate({backgroundColor:"#FE6D57"},150);
                    fpre.text(fl.name+" 失败: 大小超过10M限制");
                    pids.push(0);
                    ck();
                    return;
                }
                if(fl.size<1){
                    fpre.stop(true,false,false).animate({backgroundColor:"#FE6D57"},150);
                    fpre.text(fl.name+" 失败: 空文件或不是文件");
                    pids.push(0);
                    ck();
                    return;
                }
                if(fl.type.length<1){
                    fpre.stop(true,false,false).animate({backgroundColor:"#FE6D57"},150);
                    fpre.text(fl.name+" 失败: 不是文件");
                    pids.push(0);
                    ck();
                    return;
                }
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
            }
            if(t){
                f=t;
            }
            for(var i=0;i< f.length;i++){
                uy(f[i]);
            }
            iptf[0].value="";
        }
        dcer=ccst;
        iptf.bind("change",function(){
            ccst();
        });
        bpdbox.append(iptf);
        if(f){
            ccst(f);
        }
    };
    XAPI.updsetD=function(d){
        dcer=d;
    };
})();

$(function(){
    console.info("fileupd.js");
    var showing=false;
    // $('body').append($('<script src="https://static.websint.org/j/jquery.byteuitys.js" type="text/javascript"></script>'));
    XLIB.showFileUpd=function(callb){
        if(showing)
            return;
        var files=null;
        showing=true;
        var bdy=$('body');
        var man=$('<div class="winbox padding8"></div>');
        man.css("overflow","auto");
        bdy.append(man);
        man.append($('<h2>上传文件</h2>'));
        var appe=$('<div class="border1 center padding8 dashbgr">拖动文件到此处</div>');
        man.append(appe);
        var cancbtn=$('<button class="xui-buttom margin8 padding8 lineheight12 height30">取消</button>')
        var filebtn=$('<button class="xui-buttom margin8 padding8 lineheight12 height30">选择文件</button>');
        appe.append(filebtn);
        appe.append(cancbtn);
        var fbox=$('<input type="file" multiple>');
        filebtn.click(function(){
            fbox.click();
        });
        appe.bind('dragstart dragend dragover dragenter dragleave drop',function(e){
            console.info(e);
            e.preventDefault();
        });
        appe.bind('dragenter', function(e){
            if($(e.target).hasClass("dashbgr")){
                appe.css({opacity:1});
                filebtn.css({display:"none"});
                cancbtn.css({display:"none"});
            }
        });
        appe.bind('dragleave', function(e){
            if($(e.target).hasClass("dashbgr")){
                appe.css({opacity:0.5});
                filebtn.css({display:"inline-block"});
                cancbtn.css({display:""});
            }
        });
        appe.bind('drop', function(e){
            if(e.originalEvent.dataTransfer.files.length<1){
                appe.trigger('dragleave');
                return;
            }
            appe.text('准备上传');
            files=e.originalEvent.dataTransfer.files;
            console.info(files);
            startUpload();
        });
        cancbtn.click(function(){
            closedhk();
        });
        var filecount, filedone=0;
        function startUpload(){
            appe.remove();
            fbox.remove();
            clearInterval(fp);
            for(var i=0;i<files.length;i++){
                processFile(files[i]);
            }
            filecount=files.length;
        }
        function closedhk(){
            man.animate({opacity: 0},150,function(){
                man.remove();
                showing=false;
            });
        }
        var fids=[],fnames=[],nowtask=0;
        function processFile(file){
            var reader = new FileReader();
            reader.onload=function(e){
                // data:image/sh;base64,-------BASE-64-CONTENT------
                var resf=e.target.result.substr(e.target.result.indexOf(',')+1);
                var ftgr=$('<div>Allocing space</div>');
                $.post("/f/touch/"+encodeURIComponent(file.name),{wisChk: pdWisChk, len: file.size},function(e){
                    if(e.id){
                        var plen=Math.min(Math.floor((file.size/16)/4)*4,Math.floor((2*1024*1024)/4)*4);
                        console.info(Math.floor((file.size/16)/4)*4,Math.floor((2*1024*1024)/4)*4);
                        var fileid=e.id;
                        fids.push(fileid);
                        fnames.push(file.name);
                        ftgr.animate({backgroundColor:"#ffffff"},150);
                        ftgr.css({position: "relative"});
                        ftgr.text(file.name);
                        var parts=[];
                        console.info(resf.substr(-10));
                        for(var i=0;i<resf.length;){
                            var st=resf.substr(i,plen);
                            parts.push(st);
                            i+=st.length;
                        }
                        var pcou=parts.length;
                        var npc=1/pcou;
                        var finishPartc=0;
                        var thisdone=false;
                        function callFinish(){
                            if(finishPartc>=pcou){
                                if(thisdone){
                                    return;
                                }
                                thisdone=true;
                                ftgr.html("Finish.");
                                filedone++;
                                if(filecount<=filedone){
                                    closedhk();
                                    callb(fids,fnames);
                                }
                            }
                        }
                        function dg(i){
                            if(i>=pcou){
                                callFinish();
                                return;
                            }
                            var ps=$('<div>&nbsp;</div>');
                            ps.css({position:"absolute", width:(npc*100)+"%", left: (i*(npc*100))+"%", backgroundColor: "#eeeeee", top:"0"});
                            parts[i].ps=ps;
                            ftgr.append(ps);
                            nowtask++;
                            $.ajax({
                                contentType: "text/base64",
                                data: parts[i],
                                dataType: "json",
                                type: "POST",
                                url: "/f/write/"+fileid+"/"+i+"/base64",
                                success: function(){
                                    nowtask--;
                                    ps.animate({backgroundColor: "rgb(138, 237, 142)"},200);
                                    finishPartc++;
                                    callFinish();
                                }
                            });
                            setTimeout(function(){
                                function te(){
                                    if(nowtask<16){
                                        dg(i+1);
                                    }else{
                                        setTimeout(te,30);
                                    }
                                }
                                te();
                            },30);
                        }
                        dg(0);
                    }else{
                        ftgr.text(file.name+" - "+e.error);
                        filedone++;
                        if(filecount<=1){
                            closedhk();
                            callb(fids,fnames);
                        }
                    }
                },'json');
                man.append(ftgr);
            }
            reader.readAsDataURL(file);
        }
        appe.css({opacity:0.5});

        var fp=setInterval(function(){
            appe.stop(true,false,false).animate({height: (man.height()-75)+"px"},50);
            if(fbox[0].files.length>0){
                files=fbox[0].files;
                startUpload();
            }
        },150);
    }
});

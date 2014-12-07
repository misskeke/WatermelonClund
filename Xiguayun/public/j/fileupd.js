$(function(){
    console.info("fileupd.js");
    var showing=false;
    $('body').append($('<script src="https://static.websint.org/j/jquery.byteuitys.js" type="text/javascript"></script>'));
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
        var filebtn=$('<button class="xui-buttom margin8 padding8 lineheight12 height30">选择文件</button>');
        appe.append(filebtn);
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
            }
        });
        appe.bind('dragleave', function(e){
            if($(e.target).hasClass("dashbgr")){
                appe.css({opacity:0.5});
                filebtn.css({display:"inline-block"});
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
        function startUpload(){
            appe.remove();
            fbox.remove();
            clearInterval(fp);
            for(var i=0;i<files.length;i++){
                processFile(files[i]);
            }
        }
        var plen=30*1024*4;
        function processFile(file){
            var reader = new FileReader();
            reader.onload=function(e){
                // data:image/sh;base64,-------BASE-64-CONTENT------
                var resf=e.target.result.substr(e.target.result.indexOf(',')+1);
                var ftgr=$('<div>Allocing space</div>');
                $.post("/f/touch/"+encodeURIComponent(file.name),{wisChk: pdWisChk, len: file.size},function(e){
                    if(e.id){
                        var fileid=e.id;
                        console.info(fileid);
                        ftgr.animate({backgroundColor:"#d0d0d0"},150);
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
                        function callFinish(){
                            if(finishPartc>=pcou){
                                ftgr.html("Finish.");
                            }
                        }
                        function dg(i){
                            if(i>=pcou){
                                callFinish();
                            }
                            var ps=$('<div>&nbsp;</div>');
                            ps.css({position:"absolute", width:(npc*100)+"%", left: (i*(npc*100))+"%", backgroundColor: "#"+$.md5(parts[i]), top:"0"});
                            parts[i].ps=ps;
                            ftgr.append(ps);
                            $.post("/f/write/"+fileid,{wisChk: pdWisChk, blob: parts[i], i:i},function(){
                                ps.animate({backgroundColor: "rgb(138, 237, 142)"},200);
                                finishPartc++;
                                callFinish();
                            });
                            setTimeout(function(){
                                dg(i+1);
                            },100);
                        }
                        dg(0);
                    }else{
                        ftgr.text(file.name+" - "+e.error);
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

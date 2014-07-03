XAPI.showWorld=function(){
    var dlcont=XAPI.showCont("<h1>世界</h1>");
    dlcont.find('*').css({opacity:0,x:"150px"}).eachanimate({opacity:1,x:"0px"},true,390,75,false,"easeOutExpo",function(){});
    $("body").animate({backgroundColor:"#87CEFA"},350);
    XAPI.chgUrl({});
};
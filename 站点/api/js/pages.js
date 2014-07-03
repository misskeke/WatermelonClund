XAPI.pages={
    startPage:function(pagehash){
        XAPI.log("Start Page:: ");
        console.info(pagehash);
        if(pagehash.loginPage){
            return XAPI.showLogin();
        }
        if(pagehash.registerPage){
            return XAPI.showRegister();
        }else{
            return XAPI.showWorld();
        }
    }
};
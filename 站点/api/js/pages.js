XAPI.pages = {
    startPage: function (pagehash) {
        XAPI.log("Start Page:: ");
        console.info(pagehash);
        if (pagehash.loginPage) {
            return XAPI.showLogin();
        }
        if (pagehash.registerPage) {
            return XAPI.showRegister();
        }
        if (pagehash.picPage) {
            return XAPI.showImg(pagehash.picPage, pagehash.callback);
        }
        if (pagehash.uid) {
            return XAPI.showUser(pagehash.uid, pagehash.callback);
        }
        return XAPI.showWorld();
    }
};
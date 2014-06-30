(function () {
    XAPI.user = {}
    XAPI.log("Checking localstorage");
    var username = "";
    var password = "";
    if (!window.localStorage) {
        XAPI.log("You Boswer did not support localStorage!");
        XAPI.supportRemember = false;
        window.localStorage = {};
    } else {
        XAPI.log("Checking localstorage contant...");
        if (window.localStorage.userName) {
            XAPI.log("find user!");
            username = window.localStorage.userName;
        } else {
            XAPI.log("You had never logined here!");
        }
    }
})();

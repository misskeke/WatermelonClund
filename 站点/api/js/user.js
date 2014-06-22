(function() {
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
    XAPI.log("Creating connection to the server......");
    XAPI.connectKey=XAPI.randStr(64);
    XAPI.log("Use AES Key: "+XAPI.connectKey.substr(0,6)+"......");
    XAPI.log("Encrypting AES KEY..");
    XAPI.connectKeyRsaed=encryptedString(XAPI.rsakey,XAPI.connectKey);
    XAPI.log(XAPI.connectKeyRsaed.substr(0,6)+"...");
})();
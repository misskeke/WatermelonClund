(function() {
	function xapilog(str) {
		console.debug("[" + new Date().toTimeString().substr(0, 8) + "|XAPI] - " + str);
	}
	xapilog("loaded!");
	window.XAPI = {
		log: xapilog
	};
	XAPI.log("loading RSA api...");
	$.getScript("UI/JS/lib/rsa.js", function() {
		XAPI.log("RSA Api loaded");
		$.get("api/rsa_get_public_key/", function(rsap) {
			XAPI.log("rsa public key getted! e=" + rsap.e.substr(0, 6) + "..., m=" + rsap.m.substr(0, 6) + "...");
			setMaxDigits(259);
			XAPI.rsakey = new RSAKeyPair(rsap.e, "", rsap.m);
			XAPI.log("loading AES...");
			$.getScript("UI/JS/lib/aes.js", function() {
				XAPI.log("AES Api loaded");
				XAPI.log("loading user api...");
                XAPI.randStr = function(len) {
						len = len || 32;
						var $chars = '0123456789abcdefghijklmnopqrstovwxyz+=-[]()\/';
						var maxPos = $chars.length;
						var pwd = '';
						for (i = 0; i < len; i++) {
							pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
						}
						return pwd;
					}
				$.getScript("api/js/user.js", function() {
					XAPI.log("User Api loaded");
				});
			});
		}, "json");
	});
})();
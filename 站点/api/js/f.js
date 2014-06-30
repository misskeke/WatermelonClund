(function() {
	function xapilog(str) {
		console.info("[" + new Date().toTimeString().substr(0, 8) + "|XAPI] - " + str);
		$('.xapi_log_shower').text(str);
	}

	xapilog("loaded!");
	window.XAPI = {
		log : xapilog
	};
	$.getScript("api/js/user.js", function() {
		XAPI.log("User Api loaded");
	});
})(); 
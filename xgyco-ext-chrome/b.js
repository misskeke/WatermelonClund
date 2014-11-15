chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
		var dtd = details.url.match(/^(.+:\/\/){0,1}\.([^/\\]+)/);
        if( dtd )
            return {redirectUrl: "xgy.co/"+dtd[2] };
    },
    {urls: ["*://*/"]},
    ["blocking"]);

(function () {
    var cache = (localStorage.cache ? JSON.parse(localStorage.cache) : {});
    XAPI.cacheGet = function (name) {
        if (cache[name]) {
            if (cache[name].timeOut > 0 && cache[name].timeAdd + cache[name].timeOut <= new Date().getTime()) {
                delete cache[name];
            } else {
                return cache[name].value;
            }
        }
    };
    XAPI.cacheSet = function (name, value, timeOut) {
        if (value) {
            cache[name] = {
                timeAdd: new Date().getTime(),
                timeOut: (timeOut ? timeOut : 0),
                value: value
            }
        } else {
            delete cache[name];
        }
        try {
            localStorage.cache = JSON.stringify(cache);
        } catch (e) {
            cache = {};
            localStorage.cache = "{}";
        }
    };
})();
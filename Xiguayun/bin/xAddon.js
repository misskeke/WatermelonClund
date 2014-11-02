module.exports = function(mon,dbc,strlib,ersp){
    return {
        shoAtHandle: function(req, res){
            var ddc = req.params.dl;
            switch (ddc.substr(1)){
                case "markedit":
                    res.render('xgycoxmark', {title: "Markbox"});
                    break;
                default :
                    var ep = new Error("项目页面：不存在");
                    ep.status = "SURL_@_UNDEFINED";
                    ersp(res, ep, 404);
                    break;
            }
        }
    };
};
var osmosis = require('osmosis');

var fetchHelper = {
    /* test json
     {"alibaba.com": {
     "52-camera": [
     {
     "rule": "//title/text()",
     "attribute_name": "Titolo"
     },
     {
     "rule": "//h1/text()",
     "attribute_name": "h1"
     }
     ]
     }
     }

     {
     "swimoutlet.com": {
     "2257-sunglasses": 	[ {
     "rule": "//title/text()",
     "attribute_name": "page_title",
     "page_id": false
     }
     ]
     }}

     */
    applyEveryPath: function(url, source, paths, callback) {
        var rules = {};
        paths.forEach(function(pathObj, i) {
            if (pathObj["rule"] == null) return; //in array.forEach it's the same as 'continue' for a normal for
            var path = pathObj["rule"].trim().replace(/(\r\n|\n|\r)/gm, "");
            rules[pathObj["attribute_name"]] = path;

            if (i > paths.length) return;
            if (i == paths.length - 1) {
                //console.log("applying");
                //console.log(rules);
                //console.log("to: " + url);
                osmosis
                    .get(url)
                    .config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36')
                    .set(rules).data(function(listing){
                    console.log(listing);
                    var result = {outcome: 'success', message: listing, url:"#" }; // TODO
                    callback([result]);
                }).log(console.log)
                    .error(console.log)
                    .debug(console.log);
            }

        });
    }
};

module.exports = fetchHelper;
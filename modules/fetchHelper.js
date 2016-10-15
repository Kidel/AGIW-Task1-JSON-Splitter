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
     */
    applyEveryPath: function(url, source, paths, callback) {
        var results = [];
        var rules = {};
        paths.forEach(function(pathObj, i) {
            if (pathObj["rule"] == null) return; //in array.forEach it's the same as 'continue' for a normal for
            var path = pathObj["rule"].trim().replace(/(\r\n|\n|\r)/gm, "");
            rules[pathObj["attribute_name"]] = path;

            if (results.length > paths.length) return;
            if (i == paths.length - 1) {
                osmosis.get(url).set(rules).data(function(listing){
                    console.log(listing);
                    var result = {outcome: 'success', message: listing, url:"#" }; // TODO
                    callback([result]);
                });
            }

        });
    }
};

module.exports = fetchHelper;
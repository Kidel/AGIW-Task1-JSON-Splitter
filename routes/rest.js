var express = require('express');
var router = express.Router();

var f = require('../modules/fetchHelper');


/* GET home page.*/
router.get('/', function(req, res, next) {
    res.json({ outcome:' ', result: "" });
});

router.post('/', function(req, res, next) {
    var url = req.body.url;
    var path = req.body.path;
    var key = req.body.key;

    console.log("url: " + url);
    console.log("path: " + path);

    f.getPage(url, function(error, dirtyBody) {
        if (!error) {
            var body = f.sanitize(dirtyBody);
            f.applyXPath(body, path, function(nodes){
                console.log("returning from calls");
                if(typeof nodes != 'undefined' && typeof nodes[0] != 'undefined') {
                    //console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
                    console.log("node: " + nodes[0].toString());
                    res.json({outcome: 'success', result: key + ": [ " + path + " -> " + nodes[0].localName + " ]: " + nodes[0].toString(), url: url});
                }
                else res.json({ outcome: 'warning', result: key + ": no results for " +  path, url: url });
            });
        }
        else res.json({ outcome: 'danger', result: "error fetching page: " + error , url: url});
    });

});

module.exports = router;

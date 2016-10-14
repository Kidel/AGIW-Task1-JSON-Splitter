var express = require('express');
var router = express.Router();

var f = require('../modules/fetchHelper');


/* GET home page.*/
router.get('/', function(req, res, next) {
    res.json({ outcome:' ', result: "" });
});

router.post('/', function(req, res, next) {
    var url = req.body.url;
    var paths = req.body.paths;

    console.log("url: " + url);
    console.log("paths: " + paths);

    f.getPage(url, function(error, dirtyBody) {
        if (!error) {
            var body = f.sanitize(dirtyBody);
            f.applyXPath(body, paths, function(nodes){
                console.log("returning from calls");

                if(typeof nodes != 'undefined' && typeof nodes[0] != 'undefined') {
                    console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
                    console.log("node: " + nodes[0].toString());

                    res.json({outcome: 'success', result: nodes[0].toString()});
                }
                else res.json({ outcome: 'no results', result: "" });
            });
        }
        else res.json({ outcome: 'error fetching page', result: "" });
    });

});

module.exports = router;

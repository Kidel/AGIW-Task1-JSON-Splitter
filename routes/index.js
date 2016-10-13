var express = require('express');
var router = express.Router();

var f = require('../modules/fetchHelper');


/* GET home page.*/
router.get('/', function(req, res, next) {
    res.render('index',  { outcome:' ', url: '', path:''});
});

router.post('/', function(req, res, next) {
    var url = req.body.url;
    var path = req.body.path;

    console.log("url: " + url);
    console.log("path: " + path);

    f.getPage(url, function(error, dirtyBody) {
        if (!error) {
            var body = f.sanitize(dirtyBody);
            f.applyXPath(body, path, function(nodes){
                console.log("returning from calls");

                if(typeof nodes != 'undefined' && typeof nodes[0] != 'undefined') {
                    console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
                    console.log("node: " + nodes[0].toString());

                    res.render('index', {outcome: nodes[0].toString(), url: url, path: path});
                }
                else res.render('index', { outcome: 'error', url: url, path: path });
            });
        }
        else res.render('index', { outcome: 'error', url: url, path: path });
    });

});

module.exports = router;

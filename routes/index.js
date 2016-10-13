var express = require('express');
var router = express.Router();



var f = require('../modules/fetchHelper');




/* GET home page.
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
}); */


// try localhost:3000/?url=http://www.google.com&path=//title
router.get('/', function(req, res, next) { // todo post instead of get
    var url = req.query.url;
    var path = req.query.path;

    console.log("url: " + url);
    console.log("path: " + path);

    f.getPage(url, function(error, dirtyBody) { // todo body instead of query
        if (!error) {
            var body = f.sanitize(dirtyBody);
            var nodes = f.applyXPath(body, path);

            console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
            console.log("node: " + nodes[0].toString());

            res.render('index', { title: 'success' });
        }
        else res.render('index', { title: 'error' });
    });

});

module.exports = router;

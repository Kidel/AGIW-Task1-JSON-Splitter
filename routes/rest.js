var express = require('express');
var router = express.Router();

var f = require('../modules/fetchHelper');

/* GET home page.*/
router.get('/', function(req, res, next) {
    res.json({ outcome:' ', result: "" });
});

router.post('/', function(req, res, next) {
    var url = req.body.url;
    var paths = req.body.path;
    //var key = req.body.key;

    console.log("url: " + url);

    f.getPage(url, function(error, dirtyBody) {
        if (!error) {
            var body = f.sanitize(dirtyBody);
            f.applyEveryPath(url, body, paths, function(results){
                res.json(results)
            });
        }
        else res.json([{ outcome: 'danger', message: "error fetching page: " + error , url: url}]);
    });
});

module.exports = router;

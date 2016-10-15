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
    var source = req.body.source;

    f.applyEveryPath(url, source, paths, function(results){
        res.json(results);
    });

});

module.exports = router;
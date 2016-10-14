var express = require('express');
var router = express.Router();

var f = require('../modules/fetchHelper');


/* GET home page.*/
router.get('/', function(req, res, next) {
    res.render('index',  { title:'Xpath-AGIW' });
});

module.exports = router;

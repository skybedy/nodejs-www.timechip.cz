var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.render('about',{
        title: 'O nás',
        h1: 'O nás'
    })
});




module.exports = router;
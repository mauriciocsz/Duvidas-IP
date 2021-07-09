const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', function(req,res){
    res.sendFile(path.resolve( __dirname+'/../view/index.html'))
})

router.post('/post', function(req,res,next){
    var RA = req.body.RA;
    console.log(RA)
    res.redirect('/');
})

module.exports = router;
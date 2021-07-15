const express = require('express');
const path = require('path');
const dbmanager = require("./db_manager");

const router = express.Router();

router.get('/', function(req,res){
    res.sendFile(path.resolve( __dirname+'/../view/index.html'))
})

router.get('/perguntar', function(req,res){
    res.sendFile(path.resolve(__dirname+'/../view/form.html'))
})

router.get('/search', function(req,res){
    res.sendFile(path.resolve(__dirname+'/../view/search.html'))
})

router.post('/getQuestion',function(req,res){

    var values = {
        op:3,
        protocol: req.body.protocol,
        res: res
    }

    dbmanager(values,returnQuestion);
    
})

router.post('/post', function(req,res,next){
    
    var values = {
        op: 1,
        ra: req.body.ra,
        nome: req.body.nome,
        contato: req.body.contato,
        duvida: req.body.duvida,
        lista: req.body.lista,
        ex: req.body.ex,
        titulo: req.body.titulo,
        res: res
    }

    dbmanager(values,returnProtocol);
    
})

router.post('/success',function(req,res,next){
    res.sendFile(path.resolve( __dirname+'/../view/success.html'));
})

//Callback function called after the INSERT of a question is done
function returnProtocol(res, protocol){
    //If the protocol returned was -1 it means that the submitting has failed
    if(protocol==-1)
        res.send({res:0})
    //Otherwise, send back the protocol of the question
    else
        res.send({res: 1, protocol: protocol })
}

//Callback function called when the question's SEARCCH is done
function returnQuestion(res,question){
    //If we have recieved a question then send it back
    if(question && question!=-1){
        res.send({res:1, question: question})
    }else
        res.send({res: 0})
    
}

module.exports = router;
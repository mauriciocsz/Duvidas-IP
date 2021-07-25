const express = require('express');
const path = require('path');
const dbmanager = require("./db_manager");
const dotenv = require ('dotenv');
const  request  = require('request');
dotenv.config();

const router = express.Router();

router.get('/', function(req,res){
    res.sendFile(path.resolve( __dirname+'/../view/index.html'))
})

router.get('/perguntar', function(req,res){
    res.sendFile(path.resolve(__dirname+'/../view/form.html'))
})

router.get('404', function(req,res){
    res.sendFile(path.resolve(__dirname+'/../view/404.html'))
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


    //If the captcha is not done, return an error to the user
    if(req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null){
        res.send({res:0,captcha:1});
        return;
    }

    const secretKey = process.env.CAPTCHA_KEY;

    const verifyCaptcha = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    //Saves the current response
    let resO = res;

    //Sends a request to verify the captcha 
    request(verifyCaptcha, (res,err,body,resOri = resO) => {
        body = JSON.parse(body);

        //If the captcha failed, return an error
        if(body.success !== undefined && !body.success){
            resOri.send({res:0,captcha:1});
            return;
        }else{
            var values = {
                op: 1,
                ra: req.body.ra,
                nome: req.body.nome,
                contato: req.body.contato,
                duvida: req.body.duvida,
                lista: req.body.lista,
                ex: req.body.ex,
                titulo: req.body.titulo,
                res: resOri
            }
        
            dbmanager(values,returnProtocol);
            
        }
    })
    
    
})

router.post('/success',function(req,res,next){
    res.sendFile(path.resolve( __dirname+'/../view/success.html'));
})

router.post('/getEXList',function(req,res,next){

    dbmanager({op: 4, res: res},returnListsEx);

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

//Callback function called when the question's SEARCH is done
function returnQuestion(res,question){
    //If we have recieved a question then send it back
    if(question && question!=-1){
        res.send({res:1, question: question})
    }else
        res.send({res: 0})
    
}

//Callback function called after we retrive all lists and exercises from the DB
function returnListsEx(res,listsEx){
    if(listsEx && listsEx!=-1){
        res.send({res:1, listsEx: listsEx});
    }else
        res.send({res:0})
}

module.exports = router;
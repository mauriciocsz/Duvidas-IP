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

    let  regex = /[a-zA-Z]{2}\-[a-zA-Z]{4}\-\d{4}?$/;

    let  protocol = req.body.protocol;

     if(!regex.test(protocol)){
        res.send({res:0});
        return;
     }

    //If the captcha is not done, return an error to the user
    if(req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null){
        res.send({res:0,captcha:1});
        return;
    }
    
    const secretKey = process.env.CAPTCHA_V3_KEY;
    
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
                op:3,
                protocol: req.body.protocol,
                res: resOri
            }
        
            dbmanager(values,returnQuestion);
            
        }
    })
    
})

router.post('/post', async function(req,res,next){

    let keyValores = ['ra','duvida','lista','ex'];
    let maxSize = [6,6000,2,2]

    for(let x=0;x<keyValores.length;x++){
        if(req.body[keyValores[x]] === null || req.body[keyValores[x]] === undefined || req.body[keyValores[x]].length>maxSize[x]){
            res.send({res:0});
            return;
        }
    }

    let dados = await dbmanager({op:5,ra:req.body.ra}, ()=>{})

    if(dados===undefined || dados==-1){
        res.send({ra:1})
        return;
    }   
    let {nome, email} = dados;

    if(req.body["titulo"].length>60){
        res.send({res:0});
        return;
    }

    if(req.body["contato"].length>40){
        res.send({res:0})
        return;
    }

    //If the captcha is not done, return an error to the user
    if(req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null){
        res.send({res:0,captcha:1});
        return;
    }

    const secretKey = process.env.CAPTCHA_V3_KEY;

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
                nome: nome,
                contato: req.body.contato,
                duvida: req.body.duvida,
                lista: req.body.lista,
                ex: req.body.ex,
                titulo: req.body.titulo,
                email: email,
                res: resOri
            }
        
            dbmanager(values,returnProtocol);
            
        }
    })
    
    
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
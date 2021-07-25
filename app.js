const express = require('express');
const app = new express();

var http = require('http').createServer(app);

const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(require("./src/routes"));
app.use("/",express.static(__dirname+'/view'));

app.use(function(req,res,next){
    res.status(404);

    res.format({
        html: function(){
            res.sendFile(__dirname+'/view/404.html')
        }
    })

});

http.listen(process.env.port || 3000);

console.log("Running");

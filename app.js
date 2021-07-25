const express = require('express');
const app = new express();

var http = require('http').createServer(app);

const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

var io = require('socket.io')(http);

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

io.on('connection', socket => {
    //While initializing the form, send the lists that are available
    query("select * from tb_listas WHERE ativa=true ORDER BY id ASC;").then(data => {

        let lists = (data.rows).map(item => item.id)

        socket.emit("initialize",{lists: lists});
    })

    //Send the exercise amount of all lists
    socket.on('getEX', list =>{

         query("SELECT ex FROM tb_listas ORDER BY id ASC").then( data =>{
            let EXs = (data.rows).map(item => item.ex)
            socket.emit('recieveEX',EXs);
         })
         
    })
 })


console.log("Running");

const query = require("./src/db_query");
const dbmanager = require("./src/db_manager");


//Placeholder callback test
function testeCallback(data){
    console.log("Data recieved:")
    console.log(data)
}

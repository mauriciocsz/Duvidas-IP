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

http.listen(process.env.port || 3000);

io.on('connection', socket => {
    //While initializing the form, send the lists that are available 
    //TODO: Retrieve those lists from the database
     socket.emit("initialize",{lists:[1,2,3]});

    //Whenever requested, send the exercise amount of the current list
    //TODO get the quantity of exercises from the database using lista's value
    socket.on('getEX', list =>{
         socket.emit('recieveEX',6);
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

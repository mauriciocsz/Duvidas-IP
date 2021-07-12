const socket = io();

//Whenever on the initialization of the form, load all lists
//and get the exercise amount of the first list
socket.on("initialize",message => {
        loadCurrentLists(message.lists);
        socket.emit("getEX",message.lists[0]);
        socket.on("recieveEX", qntEX =>{
            loadCurrentExercises(qntEX);
        })
    });


var select = document.getElementById("Lista");
var choiceSelected = select.value;

//Puts all lists into a Select input
function loadCurrentLists(lists){
    var select = document.getElementById("Lista");
    for(var i=0;lists[i]!=undefined;i++){
        var opt = document.createElement('option');
        opt.value = lists[i];
        opt.innerHTML = lists[i];
        select.appendChild(opt);
    }
}

//Define the amount of exercises that are on a certain list
function loadCurrentExercises(exQnt){
    select = document.getElementById("Exercicios");
    for(var i=0;i<exQnt;i++){
        var opt = document.createElement('option');
        opt.value = i+1;
        opt.innerHTML = i+1;
        select.appendChild(opt);
    }
}

//POSTS the question using XMLHttpRequest
function submitForm() {
    var http = new XMLHttpRequest();
    http.open("POST", "/post", true);

    //Gets all inputs into an object
    var params = JSON.stringify(
        {ra: getElement("RA"),
        nome: getElement("nome"),
        titulo: getElement("titulo"),
        contato: getElement("contato"),
        lista : getElement("Lista"),
        ex: getElement("Exercicios"),
        duvida: getElement("duvida")

    });


    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader("Content-length", params.length);
    http.setRequestHeader("Connection", "close");
    http.send(params)
    
    //Gets notified as soon as the transaction is successfully completed
    http.onload = function() {

        //Parses the response
        var obj = JSON.parse(http.responseText)

        //If the operation was successful redirect to the sucess page
        if(obj.res){
            document.getElementById("protocolo").value = obj.protocol;
            document.getElementById("formProtocol").submit()
        }else
            alert("Um erro ocorreu! Tente novamente mais tarde")
    }
}

//Returns the value of an element 
function getElement(id){
    var str = document.getElementById(id).value;
    return str
}
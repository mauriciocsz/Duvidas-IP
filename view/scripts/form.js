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

    fields = ["nome","contato","RA","Lista","Exercicios","duvida"]
    if(!checkFields(fields)){
        return
    }

    let btn = document.getElementById("sendBtn");

    btn.innerHTML = "<i id='spinner' class='fa fa-refresh fa-spin' ></i>"

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
            sessionStorage.setItem("protocol",obj.protocol);
            formSubmitting = true
            document.getElementById("formProtocol").submit()
        }else{
            alert("Um erro ocorreu! Tente novamente mais tarde")
            btn.innerHTML= "Enviar Questão"
        }
            
    }
}

//Returns the value of an element 
function getElement(id){
    var str = document.getElementById(id).value;
    return str
}

function checkFields(fields){

    var proceed = true;

    for(var i=0;i<fields.length;i++){
        //alert("bo")
        let field = document.getElementById(fields[i]);
        if(field.value==""){
            field.className = "form-control is-invalid"
            proceed=false
        }
        else
            field.className= "form-control"
        
    }

    return proceed

}


function loadNextPage(){

    fields = ["nome","contato","RA"]
    if(checkFields(fields)){
        let info = document.getElementById("info")
        let duvida = document.getElementById("question");
        let card = document.getElementById("card");

        card.style.animation = "getBigger2 1s"
        

        card.style.animationPlayState= "running"

        //info.style.opacity="0"
        //card.style.maxHeight="800px"
        duvida.style.display = "block"
        info.style.display = "none"
        
    }
    
}


var formSubmitting = false;

window.onload = function() {
    window.addEventListener("beforeunload", function (e) {
        if (formSubmitting) {
            return undefined;
        }

        var confirmationMessage = 'It looks like you have been editing something. '
                                + 'If you leave before saving, your changes will be lost.';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });
};
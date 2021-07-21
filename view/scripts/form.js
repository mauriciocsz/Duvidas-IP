const socket = io();
var formSubmitting = false;

//Array containing all exercises count
var arrayEx;

const listas = document.getElementById("Lista");

//Whenever on the initialization of the form, load all lists
//and get the exercise amount of the first list
socket.on("initialize",message => {
        loadCurrentLists(message.lists);
        socket.emit("getEX");

        socket.on("recieveEX", qntEX =>{
            arrayEx = qntEX;
            loadCurrentExercises(message.lists[0]);
        })

    select.addEventListener('change', (event) => {
        loadCurrentExercises(listas.value);
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
function loadCurrentExercises(lista){
    $("#Exercicios").empty();
    select = document.getElementById("Exercicios");
    for(var i=0;i<arrayEx[lista-1];i++){
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

    const captcha = document.getElementById("g-recaptcha-response").value;

    let btn = document.getElementById("sendBtn");

    btn.innerHTML = "<i id='spinner' class='fa fa-refresh fa-spin' ></i>"

    let card = document.getElementById("card");
    let cardSucesso = document.getElementById("cardSucesso");


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
        duvida: getElement("duvida"),
        captcha: captcha

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
            document.getElementById("protocolText").innerHTML = obj.protocol;
            formSubmitting = true

            card.style.animation = "boxDisappear 1s"
            card.style.animationFillMode = "forwards"
            card.style.animationPlayState= "running"

            cardSucesso.style.display = "block"
            card.style.display = "none"

        }else{
            //If captcha was the problem, inform the user of it
            if(obj.captcha)
                alert("Captcha inválido!")
            else
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

//Check if all fields recieved are not empty
function checkFields(fields){

    var proceed = true;

    for(var i=0;i<fields.length;i++){
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


//Loads next form page
function loadNextPage(){

    fields = ["nome","contato","RA"]
    if(checkFields(fields)){
        let info = document.getElementById("info")
        let duvida = document.getElementById("question");
        let card = document.getElementById("card");

        card.style.animation = "getBigger 1s"
        

        card.style.animationPlayState= "running"

        duvida.style.display = "block"
        info.style.display = "none"
        
    }
    
}

// Gets a warning before exiting the form
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

//Function for copying the protocol into clipboard in one click
function copyProtocol(){

    const area = document.getElementById("copyTxtArea");
    area.value = document.getElementById("protocolText").innerHTML;

    area.select();

    document.execCommand('copy');
}
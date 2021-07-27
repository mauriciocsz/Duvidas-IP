var formSubmitting = true;

//Array containing all exercises count
var arrayEx;

const listas = document.getElementById("Lista");

loadLists();

var select = document.getElementById("Lista");
var choiceSelected = select.value;

//Gets all active lists from the database 
function loadLists(){
    $.ajax({
        url: "/getEXList",
        dataType: "json",
        type: "post",
        success:function(result){

            let exercises = result.listsEx;
            arrayEx = exercises.EXs;

            loadCurrentLists(exercises.lists);

            loadCurrentExercises(0)
        }
    })
}

select.addEventListener('change', (event) => {
    loadCurrentExercises(listas.value);
})

//Puts all lists into a Select input
function loadCurrentLists(lists){
    var select = document.getElementById("Lista");
    for(var i=0;lists[i]!=undefined;i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = lists[i];
        select.appendChild(opt);
    }
}

//Define the amount of exercises that are on a certain list
function loadCurrentExercises(lista){
    $("#Exercicios").empty();
    select = document.getElementById("Exercicios");
    for(var i=0;i<arrayEx[lista];i++){
        var opt = document.createElement('option');
        opt.value = i+1;
        opt.innerHTML = i+1;
        select.appendChild(opt);
    }
}

//POSTS the question using XMLHttpRequest
function submitForm() {

    document.getElementById("sendBtn").innerHTML = "<i id='spinner' class='fa fa-refresh fa-spin' ></i>"

    fields = ["nome","contato","RA","Lista","Exercicios","duvida"]
    if(!checkFields(fields)){
        return
    }

    grecaptcha.ready(function(){
        grecaptcha.execute('6LciAcEbAAAAAGU4y3suBMuJlNDwbLIChEsnlYKb', {action: 'submit'}).then(function(token){
            sendValues(token)
        })
    })

}

function sendValues(token){

    let card = document.getElementById("card");
    let cardSucesso = document.getElementById("cardSucesso");

    $.ajax({
        url:"/post",
        dataType:"json",
        type:"post",
        data:{
            ra: getElement("RA"),
            nome: getElement("nome"),
            titulo: getElement("titulo"),
            contato: getElement("contato"),
            lista : $('#Lista').find(":selected").text(),
            ex: getElement("Exercicios"),
            duvida: getElement("duvida"),
            captcha: token
        },
        success:function(result){
            if(result.res){
                document.getElementById("protocolText").innerHTML = result.protocol;
                formSubmitting = true
    
                card.style.animation = "boxDisappear 1s"
                card.style.animationFillMode = "forwards"
                card.style.animationPlayState= "running"
    
                cardSucesso.style.display = "block"
                card.style.display = "none"
    
            }else{
                //If captcha was the problem, inform the user of it
                if(result.captcha)
                    alert("Não foi possível verificar o Captcha! Tente novamente mais tarde.")
                else
                    alert("Um erro ocorreu! Tente novamente mais tarde.")
                document.getElementById("sendBtn").innerHTML= "Enviar Questão"
            }
        },
        complete:function(result){
            document.getElementById("sendBtn").innerHTML= "Enviar Questão"
        }
    })

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

    formSubmitting = false;

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
var formSubmitting = true;

//Array containing all exercises count
var arrayEx;

const listas = document.getElementById("Lista");

loadLists();

var select = document.getElementById("Lista");
var choiceSelected = select.value;

//If there's info from the previous question saved in cache, load it into the form
let info = ["RA","contato"];
info.forEach(loadStoredInfo);

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

//Prepares to submit the form, checking all fields and validating the captcha
function submitForm() {

    fields = ["RA","Lista","Exercicios","duvida"]
    if(!checkFields(fields)){
        return
    }
    
    document.getElementById("sendBtn").innerHTML = "<i id='spinner' class='fa fa-refresh fa-spin' ></i>"

    grecaptcha.ready(function(){
        grecaptcha.execute('6LciAcEbAAAAAGU4y3suBMuJlNDwbLIChEsnlYKb', {action: 'submit'}).then(function(token){
            sendValues(token)
        })
    })

}

// POSTS the form using AJAX
function sendValues(token){

    let card = document.getElementById("card");
    let cardSucesso = document.getElementById("cardSucesso");

    $.ajax({
        url:"/post",
        dataType:"json",
        type:"post",
        data:{
            ra: getElement("RA"),
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
                if(result.ra)
                    alert("Ocorreu um erro verificando seu RA! Confira-o e tente novamente.")
                //If captcha was the problem, inform the user of it
                else if(result.captcha)
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

//Loads the previous form page
function loadPreviousPage(){

    let left = document.getElementById("left");
    let right = document.getElementById("right");

    right.style.opacity = "1";
    left.style.opacity = "0.25";
    
    right.onclick = loadNextPage;
    left.onclick = "";
    
    left.style.cursor = "default";
    right.style.cursor = "pointer";
    
    let card = document.getElementById("card");

    card.style.animation = "getSmaller 1s"
    card.style.animationPlayState = "running"
    card.style.height = card.offsetHeight
    card.style.animationFillMode = "forwards"

    setTimeout(() => {
        card.style.height = "fit-content"
    }, 1000);

    $("#question").css("display","none")
    $("#info").fadeIn(200);

}

//Loads next form page
function loadNextPage(){

    formSubmitting = false;

    fields = ["RA"]
    if(checkFields(fields)){
        localStorage.setItem("contato", document.getElementById("contato").value);
        localStorage.setItem("RA", document.getElementById("RA").value);

        let card = document.getElementById("card");
        card.style.height = "fit-content";

        card.style.animation = "getBigger 1s"
        
        let left = document.getElementById("left");
        let right = document.getElementById("right");

        left.onclick = loadPreviousPage;
        right.onclick = "";

        left.style.opacity = "1";
        right.style.opacity = "0.25";

        left.style.cursor = "pointer";
        right.style.cursor = "default";

        card.style.animationPlayState= "running"
        card.style.animationFillMode = "forwards"

        $("#info").css("display","none")
        $("#question").fadeIn(400);
        
    }
    
}

//Loads stored info and puts them as input in the form
function loadStoredInfo(item){
    let current = localStorage.getItem(item);
    if(current!=null)
        document.getElementById(item).value = current;
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

//Switches the question type from Dúvida to Tutoria and vice-versa
function switchQuestionType(id){

    $(".switches").fadeTo(100,"0.4");
    $(".switches").attr("onclick","switchQuestionType(this.id)");
    $(".switches").css("cursor","pointer");

    $("#"+id).attr("onclick","");
    $("#"+id).fadeTo(100,"1");
    $("#"+id).css("cursor","default");
    if(id=="switchDuvida"){
        $(".col-sm-2").fadeIn(200)
        $("#Lista option[value=-1]").remove();
        $("#Exercicios option[value=-1]").remove();
        loadCurrentExercises(0);
    }
    else{
        $("#switchDuvida").attr("onclick","");
        $(".col-sm-2").fadeOut(200, function(){
            $("#Lista").append('<option value=-1>-1</option>')
            $("#Lista").val(-1).change();
            $("#Exercicios").append('<option value=-1>-1</option>')
            $("#Exercicios").val(-1).change();
            $("#switchDuvida").attr("onclick","switchQuestionType(this.id)");
        })
    }

}
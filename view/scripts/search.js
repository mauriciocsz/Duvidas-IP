function checkValues(){

    let  regex = /[a-zA-Z]{2}\-[a-zA-Z]{4}\-\d{4}?$/;

    let  protocol = document.getElementById("protocol").value;

     if(!regex.test(protocol)){
         alert("Protocolo inválido!")
         return 0;
     }

    grecaptcha.ready(function(){
        grecaptcha.execute('6LciAcEbAAAAAGU4y3suBMuJlNDwbLIChEsnlYKb', {action: 'submit'}).then(function(token){
            sendQuestion(protocol,token)
        })
    })
}

function sendQuestion(protocol, token){

    $.ajax({
        url:"/getQuestion",
        dataType:"json",
        type:"post",
        data:{
            protocol:protocol,
            captcha:token
        },
        success:function(result){
            //Question was found
            if(result.res)
                loadBox(result.question);
            //Question was not found
            else
                alert("Questão não encontrada!");
        }
    })
}


//Gets question on Enter
let protocolInput = document.getElementById("protocol")
protocolInput.addEventListener("keyup", function(e){
    if(e.keyCode== 13){
        e.preventDefault();
        checkValues();
    }
})


const card = document.getElementById("fileCard");
const search = document.getElementById("searchDiv");
const nav = document.getElementById("navBar");

//Loads the card with the question info
function loadBox(qs){

    setText("protocoloText", qs.id);
    setText("titulo", qs.titulo);
    if(qs.lista==-1 && qs.ex == -1)
        setText("listaEx","Tutoria")
    else
        setText("listaEx", "L"+(qs.lista).padStart(2,'0')+"EX"+(qs.ex).padStart(2,'0'));
    setText("nomeRA", qs.nome +" ("+qs.ra+")");
    setText("duvida",qs.duvida);

    if(qs.monitor)
        setText("monitor", "Dúvida respondida por " + qs.monitor);
    else
        document.getElementById("monitor").innerText = "";

    if(qs.comentario){
        document.getElementById("comentario").style.opacity = "1"
        setText("comentario","Comentário: \n"+qs.comentario);
    }
    else
        document.getElementById("comentario").style.opacity = "0"

    let status = document.getElementById("status");
    switch(qs.status){
        case 0:
            status.innerText = "Não respondida"
            status.style.color = "#DB4437"
            break;
        case 1:
            status.innerText = "Respondida"
            status.style.color = "#0F9D58"
            break;
        default:
            status.style.display = "none"
    }

    nav.style.opacity = '0';
    search.style.opacity = '0';
    card.style.display = "block"
}

function setText(id, text){
    document.getElementById(id).innerText = text;
}

//Removes the card with the question info
function removeBox(){
    card.style.display = "none"
    nav.style.opacity = '1';
    search.style.opacity = '1';
}
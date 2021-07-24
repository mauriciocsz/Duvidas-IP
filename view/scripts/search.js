function getQuestion(){

    let http = new XMLHttpRequest();
    http.open("POST", "/getQuestion", true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send('protocol='+document.getElementById("protocol").value);

    http.onload = function() {
        //Parses the response
        let obj = JSON.parse(http.responseText)

        //Question was found
        if(obj.res){
            loadBox(obj.question);
        //Question was not found
        }else
            alert("Questão não encontrada!");

    }
}


//Gets question on Enter
let protocolInput = document.getElementById("protocol")
protocolInput.addEventListener("keyup", function(e){
    if(e.keyCode== 13){
        e.preventDefault();
        getQuestion();
    }
})

function loadBox(question){


    document.getElementById("protocoloText").innerText = question.id;
    document.getElementById("titulo").innerText = question.titulo;
    document.getElementById("listaEx").innerText = "L"+(question.lista).padStart(2,'0')+"EX"+(question.ex).padStart(2,'0');
    document.getElementById("nomeRA").innerText = question.nome +" ("+question.ra+")";
    document.getElementById("duvida").innerText = question.duvida;

    if(question.monitor)
        document.getElementById("monitor").innerText = "Dúvida respondida por " + question.monitor;
    else
        document.getElementById("monitor").innerText = "";

    if(question.comentario)
        document.getElementById("comentario").innerText = "Comentário: \n"+question.comentario;
    else
        document.getElementById("comentario").style.display = "none"

    let status = document.getElementById("status");
    switch(question.status){
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

    let card = document.getElementById("fileCard");
    let search = document.getElementById("searchDiv");

    search.style.animationPlayState = "running";
    
    search.style.animationFillMode = "forwards";

    card.style.display = "block"
    card.style.opacity = 1;
}

function removeBox(){

    let card = document.getElementById("fileCard");
    let search = document.getElementById("searchDiv");

    card.style.display = "none"
    card.style.opacity = '0'
    search.style.animationPlayState = "paused";
    search.style.animationFillMode = "none";
    search.opacity = '1';

}
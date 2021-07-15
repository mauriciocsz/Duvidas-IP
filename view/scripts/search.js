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
            let div = document.getElementById("question");

            //This disgusting block is only temporary, It'll be 
            //fixed whenever I do the website's appearence overhaul
            createNode(div,obj.question.titulo)
            createNode(div,obj.question.duvida)
            createNode(div,obj.question.status)
            createNode(div,obj.question.comentario)
            createNode(div,obj.question.monitor)

        //Question was not found
        }else
            alert("Questão não encontrada!");

    }
}

function createNode(div, key){

    let node = document.createTextNode(key+" ")
    div.appendChild(node)

}
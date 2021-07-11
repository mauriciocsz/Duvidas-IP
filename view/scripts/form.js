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
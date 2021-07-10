const query = require("./db_query");

//Inserts a question on the database
function insertQuestion(values = {},callback){
    const idgen = require("./id_generator");
    var id = idgen({prefix:"IP"});
    query("INSERT INTO tb_duvidas (id,ra,nome,contato,duvida,lista,ex,status) values ($1,$2,$3,$4,$5,$6,$7,$8);",
    [id,values.ra,values.nome,values.contato,values.duvida,values.lista,values.ex,0]).then(data => {
        if(data==-1)
            callback (-1);
        else
            callback (1);
    })
}

//Retrieves questions based on the given RA
function retrieveQuestions(values = {},callback){
    query("SELECT id, status, date, lista, ex FROM tb_duvidas WHERE ra=$1",[values.ra]).then(data => {
        if(data==-1)
            callback(-1);
        else
            callback(data.rows);
    })
}

//Function responsible for deciding which operation will take place
// 1 = insert Question;
// 2 = retrieve questions based on RA
module.exports =  function opManager(values = {}, callback){
    switch(values.op){
        case 1:
            if(values.ra && values.nome && values.contato && values.duvida && values.lista && values.ex)
                insertQuestion(values,callback);
            else return -1;
            break;
        case 2: 
            if(values.ra)
                retrieveQuestions(values,callback);
            else return -1;
            break;
        default:
            return;
    }
}
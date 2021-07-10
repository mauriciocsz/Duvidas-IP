const dotenv = require ('dotenv');
var {Pool} = require('pg');
dotenv.config();

//DB authentication
var pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl:true
});

//Query function it recieves a 'query' and the 'values' that go into it, this
//prevents any SQL injections from working
module.exports = async function newQuery(query, values){

    //We try performing the query, if it doesn't work we print the error on console
    //and return a '-1' to indicate that the query has failed. If the query does work
    //we return the result produced by that query.
    try{
        var result = await pool.query({
            text: query,
            values
        });
        return result;
    }catch(error){
        console.log("=================\nError on Query: \n"+error)
        return -1;
    };
}




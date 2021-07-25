
function randomStr(strLength) {
    const chars = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' ];
    return [ ...Array(strLength) ]
    .map(() => chars[Math.trunc(Math.random() * chars.length)])
    .join('');
   }
   
module.exports = function uid(options = {}) {
   const now = String(Date.now());
   const middlePos = Math.ceil(now.length / 1.5);
    let output = `${randomStr(4)}-${now.substr(middlePos)}`;
    if (options.prefix) 
        output = `${options.prefix}-${output}`;
   return output;
}


//The code above is HEAVILY inspired by José Manuel Aguirre's "Generation of unique id in the database"
//https://itnext.io/generation-unique-ids-in-the-database-a9a7acd0e721

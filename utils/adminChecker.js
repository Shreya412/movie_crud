const pool = require("../database/connection")
const queries = require("../queries/user")
function isAdmin(id) {
    pool.query(queries.getUserById, [id], (err, result) =>{
        //check_admin
        console.log(result.rows[0]);
        if (result.rows[0].is_admin == true){
            return true;
        } else {return false;}})
     ;
}

module.exports = isAdmin;
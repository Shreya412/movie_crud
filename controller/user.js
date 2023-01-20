const pool = require("../database/connection")
const queries = require("../queries/user")
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator")
const isAdmin = require("../utils/adminChecker")


const addUser = async (req, res) => {
    try{
        //1. destructure req.body
        const { name, email, password, is_admin} = req.body;

        //2. Check if user exists
        pool.query(queries.checkEmailExists, [email], (err, result) =>{
            if(result.rows.length) {
                res.status(401).send("User already exists")
            };
        });

        //3. Bcrypt User password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. Add new user
        pool.query(queries.addUser, [name, email, bcryptPassword, is_admin], (err, result) => {

        //5. Generate jwt token
        const token = jwtGenerator(result.rows[0].id);

        // if (err) throw err;
        res.json({token});
        console.log("User added Successfully");
        res.end();
        });
      
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const loginUser = (req, res) => {
    try{
        //1. destructure req.body
        const { email, password} = req.body;

        //2. check if user doesn't exist
        pool.query(queries.checkEmailExists, [email], async (err, result) =>{
            if(result.rows.length === 0) {
                res.status(401).send("User does not exists")
            };

             //3. check password
            const validPassword = await bcrypt.compare(password, result.rows[0].password)
            
            if (!validPassword){
                res.status(401).send("Password or Email Incorrect")           
            };

        //4. give jwt token on login 
        const token = jwtGenerator(result.rows[0].id);
        res.json({token});

        console.log("User Logged in Successfully");
        res.end();
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


const getUsers = (req, res) => {
    try{
        console.log("getting users");
        if(isAdmin(req.user) == true){
        pool.query(queries.getUsers, (err, result) => {
            console.log("Data loaded Successfully");
            res.json(result.rows);
            res.end();
        });
    } else {
        res.status(500).send("Not authorized")
    }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    
};

const getUserById = (req, res) => {
    try{
        console.log("Getting user by id");
        const id = parseInt(req.params.id);
        if(isAdmin(req.user) == true){
            pool.query(queries.getUserById, [id], (err, result) =>{
                res.status(200).send(result.rows);
            })
        } else {
            if (req.user == id){
                pool.query(queries.getUserById, [id], (err, result) =>{
                    res.status(200).send(result.rows);
                })
            } else{
                res.status(500).send("Not authorized")
            }}
        } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const updateUser = (req, res) => {
    try{
        console.log("Updating user");
        const id = parseInt(req.params.id);
        const { name, email, password } = req.body;

        if(isAdmin(req.user) == true){
            pool.query(queries.getUserById, [id], async (err, result) =>{
                const noUserFound = !result.rows.length;
                if (noUserFound){
                    res.send("User does not exists")
                };
    
                const saltRound = 10;
                const salt = await bcrypt.genSalt(saltRound);
                const bcryptPassword = await bcrypt.hash(password, salt);
    
                pool.query(queries.updateUser, [name, email, bcryptPassword, id], (err, result) =>{
                    res.status(200).send("User updated");
                });
            });
        } else{

        if (req.user == id){

        pool.query(queries.getUserById, [id], async (err, result) =>{
            const noUserFound = !result.rows.length;
            if (noUserFound){
                res.send("User does not exists")
            };
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password, salt);

            pool.query(queries.updateUser, [name, email, bcryptPassword, id], (err, result) =>{
                res.status(200).send("User updated");
            });
        });
    }  
    else {res.status(500).send("Not authorized")}
    }
} catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const deleteUser = (req, res) => {
    try{
        console.log("Deleting user by id");
        const id = parseInt(req.params.id);
        if(isAdmin(req.user) == true) {

                pool.query(queries.getUserById, [id], (err, result) =>{
                    const noUserFound = !result.rows.length;
                    if (noUserFound){
                        res.send("User does not exists")
                    };
                    pool.query(queries.deleteUser, [id], (err, result) =>{
                        res.status(200).send("user deleted");
                    });
                   
                });
            } else {
                if (req.user == id){
                    pool.query(queries.getUserById, [id], (err, result) =>{
                        const noUserFound = !result.rows.length;
                        if (noUserFound){
                            res.send("User does not exists")
                        };
                        pool.query(queries.deleteUser, [id], (err, result) =>{
                            res.status(200).send("user deleted");
                        });
                        
                    });
                }  else {  
                    res.status(500).send("Not authorized")
                }
              
            }
        } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }}



module.exports = {
    getUsers,
    addUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
};
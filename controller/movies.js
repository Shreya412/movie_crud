const pool = require("../database/connection")
const queries = require("../queries/movies")
const isAdmin = require("../utils/adminChecker")


const addMovie = (req, res) => {
    try{
        if( isAdmin(req.user) == true ){
            console.log("**************")
        //1. destructure req.body
        const { movie_name, rating } = req.body;

        //2. Check if user exists
        pool.query(queries.checkMovieExists, [movie_name], (err, result) =>{
            if(result.rows.length) {
                res.status(401).send("Movie already exists")
            };
        });

        //4. Add new user
        pool.query(queries.addMovie, [movie_name, rating], (err, result) => {
        res.send(result)
   
        console.log("Movie added Successfully");
        res.end();
        });
      
     } else{
        res.status(500).send("Not authorized")
    }
} catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const getMovies = (req, res) => {
    try{

        console.log("getting users");
        pool.query(queries.getMovies, (err, result) => {
            console.log("Data loaded Successfully");
            res.json(result.rows);
            res.end();
        });
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    
};

const getMovieById = (req, res) => {
    try{
        console.log("Getting movie by id");
        const id = parseInt(req.params.id);
            pool.query(queries.getMovieById, [id], (err, result) =>{
                res.status(200).send(result.rows);
            })
        } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const updateMovie = (req, res) => {
    try{
        console.log("Updating user");
        const id = parseInt(req.params.id);
        const { movie_name, rating} = req.body;

        if(isAdmin(req.user) == true){
            pool.query(queries.getMovieById, [id], async (err, result) =>{
                const noUserFound = !result.rows.length;
                if (noUserFound){
                    res.send("User does not exists")
                };
                pool.query(queries.updateMovie, [movie_name, rating, id], (err, result) =>{
                    res.status(200).send("Details updated");
                });
            });
        } else{
            res.status(500).send("Not authorized")
    }
} catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const deleteMovie = (req, res) => {
    try{
        console.log("Deleting movie by id");
        const id = parseInt(req.params.id);
        if(isAdmin(req.user) == true) {

                pool.query(queries.getMovieById, [id], (err, result) =>{
                    const noUserFound = !result.rows.length;
                    if (noUserFound){
                        res.send("Movie does not exists")
                    };
                    pool.query(queries.deleteMovie, [id], (err, result) =>{
                        res.status(200).send("movie deleted");
                    });
                   
                });
            }else {  
                    res.status(500).send("Not authorized")
                }
        } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }}



module.exports = {
    getMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
};
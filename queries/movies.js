const getMovies = "SELECT * FROM movies";
const addMovie = "INSERT INTO movies (movie_name, rating) VALUES ($1, $2)";
const checkMovieExists = "SELECT s.* FROM movies s WHERE s.movie_name = $1";
const getMovieById = "SELECT * FROM movies WHERE movie_id = $1";
const deleteMovie = "DELETE FROM movies WHERE movie_id = $1";
const updateMovie = "UPDATE movies SET movie_name = $1, rating = $2 WHERE movie_id = $3";

module.exports = {
    getMovies,
    addMovie,
    getMovieById,
    deleteMovie,
    updateMovie,
    checkMovieExists,
};
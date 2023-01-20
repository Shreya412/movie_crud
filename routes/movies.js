const { Router } = require('express')
const controller = require("../controller/movies");
const middleware = require("../middleware/index")

const router = Router();

router.get("/list", controller.getMovies);
router.post("/addMovie", middleware.isAuthenticated, controller.addMovie);
// router.get("/movie/:id", controller.getMovieById);
// router.put("/movie/:id", middleware.isAuthenticated, controller.updateMovie);
// router.delete("/movie/:id", middleware.isAuthenticated, controller.deleteMovie);

module.exports = router;
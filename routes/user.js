const { Router } = require('express')
const controller = require("../controller/user");
const middleware = require("../middleware/index")

const router = Router();

router.get("/get", middleware.isAuthenticated, controller.getUsers);
router.post("/register", controller.addUser);
router.post("/login", controller.loginUser);
router.get("fhjfhf/:id", middleware.isAuthenticated, controller.getUserById);
router.put("fgfhgfhf/:id", middleware.isAuthenticated, controller.updateUser);
router.delete("gfh/:id", middleware.isAuthenticated, controller.deleteUser);

module.exports = router;
const jwt = require("jsonwebtoken");
require("dotenv").config()

function notFound(req, res, next) {
	res.status(404);
	const error = new Error("Not Found", req.originalUrl);
	next(error);
};

function isAuthenticated(req, res, next) {
	const jwtToken = req.header("token");
	if (!jwtToken){
		return res.status(403).json("Not Authenticated");
	};

	const payload = jwt.verify(jwtToken, process.env.jwtSecret);
	req.user = payload.user;
	next();
};

module.exports = {
	notFound,
	isAuthenticated,
};
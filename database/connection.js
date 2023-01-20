const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
	host: process.env.HOST,
	port: process.env.PORT,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

module.exports = pool;
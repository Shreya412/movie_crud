// Imports
const express = require('express');

const { notFound } = require("./middleware/index");
const { urlencoded } = require("body-parser");
const cors = require("cors");

// Define app
const app = express();

// .env configuration
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

//* Main Routes
app.use(require("./routes/user.js")); 
app.use(require("./routes/movies.js")); 

// app.use(require("./routes/watchlist")); 

//! Error Handling
app.use(notFound);

// Port
const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
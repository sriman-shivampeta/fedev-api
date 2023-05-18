const express = require('express');
const bodyParser = require('body-parser');
require('dotenv/config');

// Configuration and Connection to Database
const InitiateMongoServer = require("./config/db");
InitiateMongoServer();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Router's
const user = require("./routes/user");
const postRoute = require('./routes/posts');
const registerRoute = require('./routes/registers');
const expenseRoute = require('./routes/expense');

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Use of Router's
app.use("/user", user);
app.use('/posts', postRoute);
app.use('/expense', expenseRoute);
app.use('/register', registerRoute);

app.get('/', (req, res) => {
  console.log(req);
  res.send('API Working');
});

// Listening to the PORT
app.listen(PORT, (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
});

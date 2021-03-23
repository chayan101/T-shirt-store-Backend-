const express = require("express");
require('dotenv').config();
var bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
var cookieParser = require('cookie-parser');
var  listRoutes = require("./routes/list");
const { isAuthorised} = require("./controllers/auth");





//firing up server
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());


//routes
app.use("/api/auth", authRoutes);
app.use("/api" ,isAuthorised, listRoutes);


//listening
const port = process.env.port || 8000;
app.listen(port , ()=>{
  console.log(`listening to ${port}...... `);
});

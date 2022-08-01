const express = require("express");
const dotenv = require("dotenv");

var userRoute = require('./routes/usersRoute')

dotenv.config({
  path: "config.env",
});

var app = express();

app.use(express.json())

app.use('/crud/users', userRoute);

var port = process.env.server_port || 8080;
app.listen(port, () => {
  console.log("Server is up & running at http://localhost:" + port);
});


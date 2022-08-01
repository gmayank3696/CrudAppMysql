const express = require("express");
var db_functions = require("../DBConfig/db_file");
var jwt = require("jsonwebtoken");

var router = express.Router();

router.get("/", async (req, res) => {
  result = await db_functions.findAllUsers();

  if (!(result.length === 0)) res.status(200).send(result);
  else res.status(404).send("No result found");
});

router.post("/login", async (req, res) => {
  result = await db_functions.findUserByID(req.body.userid);
  if (result.length === 0) res.status(404).send("No result found");

  if (!(result[0].User_password === req.body.userpassword))
    res.status(404).send("Login not Authorised, Password incorrect !!");
  else {
    if (result[0].User_jsonWebToken) {
    //   console.log("INSIDE Token Verification");
    //   console.log(result[0].User_jsonWebToken)
      var user = jwt.verify(
        result[0].User_jsonWebToken,
        process.env.private_key_jwt
      );
    //   console.log("user");
    //   console.log(user);
      if (user._id === result[0].User_ID) {
        res.status(200).send("Login Successful");
      }else{
        res.status(404).send("Login Not Successful");
      }
    } else {
      var jwtParams = {
        expiresIn: "300d"
      }

    //   console.log("process.env.private_key_jwt", process.env.private_key_jwt)
      let token = jwt.sign(
        { _id: result[0].User_ID },
        process.env.private_key_jwt,
        jwtParams
      )

      var data = result[0];

      data.User_jsonWebToken = token;

      var status = await db_functions.updateUserData_jwt(data);

      if (status.changedRows) {
        res.status(200).send("Login Successful");
      }
    }
  }
});

router.post('/signup', async (req, res) => {
    var userdata = {
        user_name: req.body.user_name,
        user_password: req.body.user_password
    };

    console.log(userdata)
    stat = await db_functions.insert_new_users_usertab(userdata);

    if(stat.insertId)
        res.status(200).send("Insertion Successful, user_id : " + stat.insertId);
    else
        res.status(404).send("Creation Failed, User already exists!!")
})

module.exports = router;

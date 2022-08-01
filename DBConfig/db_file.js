const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({
  path: "config.env",
});

// console.log(process.env.mysql_host)
// console.log(process.env.mysql_user)
// console.log(process.env.mysql_password)
// console.log(process.env.database_name)

const mysql_pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.mysql_host,
  user: process.env.mysql_user,
  password: process.env.mysql_password,
  database: process.env.database_name,
});

console.log("DB connection pool created");

const findAllUsers = () => {
  return new Promise((resolve, reject) => {
    mysql_pool.getConnection((err, connection) => {
      if (err) {
        //connection.release();
        console.log(" Error getting mysql_pool connection: " + err);
      } else {
        connection.query(
          `SELECT * FROM ${process.env.database_name}.users;`,
          function (err, result) {
            if (err) reject(err);
            else resolve(result);
          }
        );
      }
    });
  });
};

const findUserByID = (userID) => {
  return new Promise((resolve, reject) => {
    mysql_pool.getConnection((err, connection) => {
      if (err) {
        //connection.release();
        console.log(" Error getting mysql_pool connection: " + err);
      } else {
        connection.query(
          `SELECT * FROM ${process.env.database_name}.users WHERE user_id = '${userID}';`,
          function (err, result) {
            if (err) reject(err);
            else resolve(result);
          }
        );
      }
    });
  });
};

const updateUserData_jwt = (userdata) => {
  return new Promise((resolve, reject) => {
    mysql_pool.getConnection((error, connection) => {
      if (error) console.log(" Error getting mysql_pool connection: " + err);
      else {
        connection.query(
          `UPDATE ${process.env.database_name}.users SET User_jsonWebToken = '${userdata.User_jsonWebToken}' WHERE User_ID = '${userdata.User_ID}';`,
          function (err, result) {
            if (err) reject(err);
            else resolve(result);
          }
        );
      }
    });
  });
};

const insert_new_users_usertab = (userData) => {
  return new Promise((resolve, reject) => {
    mysql_pool.getConnection((error, connection) => {
      if (error) console.log(" Error getting mysql_pool connection: " + error);
      else {
        connection.query(
          `SELECT * FROM ${process.env.database_name}.users WHERE User_name = '${userData.user_name}';`,
          function (err, result) {
            if (err) {
              console.log("Error - No record selected");
            } else {
              //resolve(result);
              //console.log(result.length === 0);
              if(result.length === 0){
                connection.query(
                  `INSERT INTO ${process.env.database_name}.users (User_name, User_password) values ('${userData.user_name}', '${userData.user_password}');`,
                  function (error, insertresult) {
                    if (error) reject(error);
                    else resolve(insertresult);
                  }
                );
              }
              else{
                resolve("{User Already Available in system !}")
              }
            }
          }
        );
      }
    });
  });
};

module.exports = {
  findAllUsers,
  findUserByID,
  updateUserData_jwt,
  insert_new_users_usertab,
};

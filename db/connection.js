const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: "localhost",
      // Your MySQL username,
      user: "root",
      // Your MySQL password
      password: "*Km#a+*)8uuqG}3",
      database: "team_db",
    },
    // console.log("Connected to the team database.")
  );

module.exports = db;
const colors = require("colors");
const figlet = require('figlet');

const db = require("./db/connection");

const startApp = require('./utils/queries');

db.connect((err) => {
  if (err) throw err;
//   console.log("Connected to team database");
  figlet('TEAM MANAGER', function(err, data) {
    console.log(data.red)
    startApp();
});
});

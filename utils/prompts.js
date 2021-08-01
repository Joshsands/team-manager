const colors = require("colors");

const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../db/connection");

function startApp() {
  inquirer
    .prompt({
      name: "main_menu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "VIEW ALL EMPLOYEES".green,
        "VIEW ALL DEPARTMENTS".blue,
        "VIEW ALL ROLES".magenta,
        "EXIT".red,
      ],
    })
    .then((answer) => {
      switch (answer.main_menu) {
        case "VIEW ALL EMPLOYEES".green:
          viewEmployees();
          break;

        case "VIEW ALL DEPARTMENTS".blue:
          viewDepartments();
          break;

        case "VIEW ALL ROLES".magenta:
          viewRoles();
          break;

        case "EXIT".red:
          db.end();
          break;
      }
    });
}

function viewEmployees () {
    console.log('view employees')
    startApp();
}

function viewDepartments () {
    console.log('view departments')
    startApp();
}

function viewRoles () {
    console.log('view roles')
    startApp();
}

module.exports = startApp;

const colors = require("colors");

const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../db/connection");

// start the the main menu
function startApp() {
  inquirer
    .prompt({
      name: "main_menu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "EMPLOYEE MENU".green,
        "DEPARTMENT MENU".blue,
        "ROLE MENU".magenta,
        "EXIT".red,
      ],
    })
    .then((answer) => {
      switch (answer.main_menu) {
        case "EMPLOYEE MENU".green:
          employeeMenu();
          break;

        case "DEPARTMENT MENU".blue:
          departmentMenu();
          break;

        case "ROLE MENU".magenta:
          roleMenu();
          break;

        case "EXIT".red:
          db.end();
          break;
      }
    });
}

// view all employee CRUD options.
function employeeMenu() {
  inquirer
    .prompt({
      name: "employee_options",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "SORT EMPLOYEES".green,
        "ADD EMPLOYEE".blue,
        "UPDATE EMPLOYEE".magenta,
        "DELETE EMPLOYEE".yellow,
        "MAIN MENU".red,
      ],
    })
    .then((answer) => {
      switch (answer.employee_options) {
        case "SORT EMPLOYEES".green:
          sortEmployees();
          break;

        case "ADD EMPLOYEE".blue:
          addEmployee();
          break;

        case "UPDATE EMPLOYEE".magenta:
          updateEmployee();
          break;

        case "DELETE EMPLOYEE".yellow:
          deleteEmployee();
          break;

        case "MAIN MENU".red:
          startApp();
          break;
      }
    });
}

// sort employees
function sortEmployees() {
  inquirer
    .prompt({
      name: "sort_employees",
      type: "list",
      message: "How would you like to sort employees?",
      choices: [
        "VIEW ALL".green,
        "SORT BY MANAGER".blue,
        "SORT BY DEPARTMENT".magenta,
        "EMPLOYEE MENU".red,
      ],
    })
    .then((answer) => {
      switch (answer.sort_employees) {
        case "VIEW ALL".green:
            viewAllEmployees();
            break;

        case "SORT BY MANAGER".blue:
          sortByManager();
          break;

        case "SORT BY DEPARTMENT".magenta:
          sortByDepartment();
          break;

        case "EMPLOYEE MENU".red:
          employeeMenu();
          break;
      }
    });
}

function viewAllEmployees () {
    const sql = `SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.title AS role,
    roles.salary,
    departments.name AS department,
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager FROM employees
    LEFT JOIN roles ON role_id = roles.id
    LEFT JOIN departments ON department_id = departments.id
    LEFT JOIN managers ON manager_id = managers.id;`

        db.query(sql,
            (err, res) => {
                if (err) throw err
                console.table(res)
                sortEmployees()
            }
        )
    };



function departmentMenu() {
  console.log("view departments");
  startApp();
}

function roleMenu() {
  console.log("view roles");
  startApp();
}

module.exports = startApp;

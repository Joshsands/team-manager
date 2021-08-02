const colors = require("colors");

const inquirer = require("inquirer");
const table = require("console.table");
const db = require("../db/connection");

// |||||||||||||||||||||||||||||||| MAIN MENU START ||||||||||||||||||||||||||||||||
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

// |||||||||||||||||||||||||||||||| MAIN MENU END||||||||||||||||||||||||||||||||

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

// sort employee options start
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

function viewAllEmployees() {
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
    LEFT JOIN managers ON manager_id = managers.id;`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    sortEmployees();
  });
}

function sortByManager() {
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
    LEFT JOIN managers ON manager_id = managers.id
    ORDER BY manager_id;`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    sortEmployees();
  });
}

function sortByDepartment() {
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
    LEFT JOIN managers ON manager_id = managers.id
    ORDER BY departments.id;`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    sortEmployees();
  });
}
// sort employee options end

// add employee start
function addEmployee() {
  const sqlMgr = `SELECT * FROM managers;`;

  let managerArray = [];
  let managerInfo = [];

  db.query(sqlMgr, (err, res) => {
    if (err) throw err;
    managerInfo = res;
    res.forEach((manager) =>
      managerArray.push(`${manager.first_name} ${manager.last_name}`)
    );
  });

  const sqlRole = `SELECT * FROM roles;`;
  let rolesArr = [];
  let rolesInfo = [];
  db.query(sqlRole, (err, res) => {
    if (err) throw err;
    rolesInfo = res;
    res.forEach((role) => rolesArr.push(`${role.title}`));
  });

  const employeeQuery = [
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "first_name",
      validate: (input) => {
        if (input) {
          return true;
        } else {
          console.log("What is the employee's first name?");
          return false;
        }
      },
    },
    {
      type: "input",
      message: "What is the employee's last name?",
      name: "last_name",
      validate: (input) => {
        if (input) {
          return true;
        } else {
          console.log("What is the employee's last name?");
          return false;
        }
      },
    },
    {
      type: "list",
      message: "What is the employee's role?",
      name: "role",
      choices: rolesArr,
    },
    {
      type: "list",
      message: "Who is the employee's Manager?",
      name: "manager",
      choices: managerArray,
    },
  ];
  inquirer.prompt(employeeQuery).then((answer) => {
    let roleId;
    rolesInfo.forEach((role) => {
      if (role.title === answer.role) {
        roleId = role.id;
      }
    });

    let mgrId;

    let firstName = answer.manager.split(" ")[0];
    let lastName = answer.manager.split(" ").pop();

    managerInfo.forEach((manager) => {
      if (firstName === manager.first_name && lastName === manager.last_name) {
        mgrId = manager.id;
      }
    });
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`;
    const params = [answer.first_name, answer.last_name, roleId, mgrId];
    db.query(sql, params, (err, res) => {
      if (err) throw err;
      console.log("EMPLOYEE ADDED SUCCESSFULLY!".green);
      employeeMenu();
    });
  });
}
// add employee end

// update employee start
function updateEmployee() {
  const sqlEmpl = `SELECT * FROM employees`;
  let emplArr = [];
  let empData = [];
  db.query(sqlEmpl, (err, res) => {
    if (err) throw err;
    empData = res;
    res.forEach((employee) =>
      emplArr.push(`${employee.first_name} ${employee.last_name}`)
    );
  });

  const sqlMgr = `SELECT * FROM managers;`;
  let mgrArr = [];
  let mgrData = [];
  db.query(sqlMgr, (err, res) => {
    if (err) throw err;
    mgrData = res;
    res.forEach((manager) =>
      mgrArr.push(`${manager.first_name} ${manager.last_name}`)
    );
  });

  const sqlRole = `SELECT * FROM roles;`;
  let rolesArr = [];
  let rolesData = [];
  db.query(sqlRole, (err, res) => {
    if (err) throw err;
    rolesData = res;
    res.forEach((role) => rolesArr.push(`${role.title}`));
  });
  const updateQ = [
    {
      type: "confirm",
      name: "update",
      message: "Are you sure?",
      default: true,
    },
    {
      type: "list",
      name: "employee",
      message: "Which Employee do you want to update?",
      choices: emplArr,
      when: ({ update }) => update,
    },
    {
      type: "confirm",
      name: "confirmNF",
      message: "Do you need to edit their First Name?",
      default: false,
      when: ({ update }) => update,
    },
    {
      type: "input",
      name: "newFirstName",
      message: "What is the Employee's First Name?",
      when: ({ confirmNF }) => confirmNF,
      validate: (input) => {
        if (input) {
          return true;
        } else {
          console.log("What is the Employee's First Name?");
          return false;
        }
      },
    },
    {
      type: "confirm",
      name: "confirmNL",
      message: "Do you need to edit their Last Name?",
      default: false,
      when: ({ update }) => update,
    },
    {
      type: "input",
      name: "newLastName",
      message: "What is the Employee's Last Name?",
      when: ({ confirmNL }) => confirmNL,
      validate: (input) => {
        if (input) {
          return true;
        } else {
          console.log("What is the Employee's Last Name?");
          return false;
        }
      },
    },
    {
      type: "list",
      message: "What is the Employee's New Role?",
      name: "role",
      choices: rolesArr,
      when: ({ update }) => update,
    },
    {
      type: "list",
      message: "Who is the New Manager?",
      name: "manager",
      choices: mgrArr,
      when: ({ update }) => update,
    },
  ];
  inquirer.prompt(updateQ).then((choice) => {
    if (choice.update === false) {
      return employeeMenu();
    }

    let roleId;
    rolesData.forEach((role) => {
      if (role.title === choice.role) {
        roleId = role.id;
      }
    });

    let empId;

    let employeeFirstName = choice.employee.split(" ")[0];
    let employeeLastName = choice.employee.split(" ").pop();
    empData.forEach((employee) => {
      if (
        employeeFirstName === employee.first_name &&
        employeeLastName === employee.last_name
      ) {
        empId = employee.id;
      }
    });

    let newFirst;
    if (choice.confirmNF === true) {
      newFirst = choice.newFirstName;
    } else {
      newFirst = employeeFirstName;
    }
    let newLast;
    if (choice.confirmNL === true) {
      newLast = choice.newLastName;
    } else {
      newLast = employeeLastName;
    }

    let mgrId;

    let firstName = choice.manager.split(" ")[0];
    let lastName = choice.manager.split(" ").pop();

    mgrData.forEach((manager) => {
      if (firstName === manager.first_name && lastName === manager.last_name) {
        mgrId = manager.id;
      }
    });
    const sql = `UPDATE employees SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?;`;
    const params = [newFirst, newLast, roleId, mgrId, empId];
    db.query(sql, params, (err, res) => {
      if (err) throw err;
      console.log(`EMPLOYEE UPDATED SUCESSFULLY!`.green);
      employeeMenu();
    });
  });
}
// update employee end

//delete employee start
function deleteEmployee() {
  const sqlEmpl = `SELECT * FROM employees`;
  let emplArr = [];
  let empData = [];
  db.query(sqlEmpl, (err, res) => {
    if (err) throw err;
    empData = res;
    res.forEach((employee) =>
      emplArr.push(`${employee.first_name} ${employee.last_name}`)
    );
  });
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirmDelete",
        message: "Are you sure?",
        default: false,
      },
      {
        type: "list",
        message: "What Employee is beeing deleted?",
        name: "employee",
        when: ({ confirmDelete }) => confirmDelete,
        choices: emplArr,
      },
    ])
    .then((choice) => {
      let empId;
      let employeeFirstName = choice.employee.split(" ")[0];
      let employeeLastName = choice.employee.split(" ").pop();
      empData.forEach((employee) => {
        if (
          employeeFirstName === employee.first_name &&
          employeeLastName === employee.last_name
        ) {
          empId = employee.id;
        }
      });
      db.query(`DELETE FROM employees WHERE id = ?;`, empId, (err, res) => {
        if (err) throw err;
        console.log(`EMPLOYEE HAS BEEN DELETED SUCCESSFULLY!`.green);
        employeeMenu();
      });
    });
}
//delete employee end

// |||||||||||||||||||||||||||||||| EMPLOYEE MENU END ||||||||||||||||||||||||||||||||

// |||||||||||||||||||||||||||||||| DEPARTMENT MENU START ||||||||||||||||||||||||||||||||
function departmentMenu() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "VIEW ALL DEPARTMENTS".green,
        "ADD A DEPARTMENT".blue,
        "DELETE A DEPARTMENT".magenta,
        "MAIN MENU".red,
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "VIEW ALL DEPARTMENTS".green:
          viewAllDepartments();
          break;

        case "ADD A DEPARTMENT".blue:
          addDepartment();
          break;

        case "DELETE A DEPARTMENT".magenta:
          deleteDepartment();
          break;

        case "MAIN MENU".red:
          startApp();
          break;
      }
    });
}

function viewAllDepartments() {
  db.query(`SELECT * FROM  departments`, (err, res) => {
    if (err) throw err;
    console.table(res);
    departmentMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "What is the name of the new department?",
      name: "name",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("What is the name of the new department?");
        }
      },
    })
    .then((answer) => {
      db.query(
        `INSERT INTO departments SET ?`,
        {
          name: answer.name,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`DEPARTMENT HAS BEEN ADDED SUCCESSFULLY!`.green);
          console.table(answer);
          departmentMenu();
        }
      );
    });
}

function deleteDepartment() {
  const sqlDepartments = `SELECT * FROM departments;`;
  let departmentsArray = [];
  db.query(sqlDepartments, (err, res) => {
    if (err) throw err;
    res.forEach((dept) => departmentsArray.push(`${dept.name}`));
  });
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirmId",
        message: "Are you sure?",
        default: true,
      },
      {
        type: "list",
        message: "What Department do you want to delete?",
        name: "department",
        when: ({ confirmId }) => confirmId,
        choices: departmentsArray,
      },
    ])
    .then((answer) => {
      console.log(answer.department);
      db.query(
        `DELETE FROM departments WHERE departments.name = ?`,
        answer.department,
        (err, res) => {
          if (err) {
            throw err;
          } else {
            console.log(`DEPARTMENT HAS BEEN REMOVED SUCCESSFULLY!`.green);
            departmentMenu();
          }
        }
      );
    });
}
// |||||||||||||||||||||||||||||||| DEPARTMENT MENU END ||||||||||||||||||||||||||||||||

// |||||||||||||||||||||||||||||||| ROLE MENU START ||||||||||||||||||||||||||||||||
function roleMenu() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "VIEW ALL ROLES".green,
        "ADD A ROLE".blue,
        "DELETE A ROLE".magenta,
        "MAIN MENU".red,
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "VIEW ALL ROLES".green:
          viewAllRoles();
          break;

        case "ADD A ROLE".blue:
          addRoles();
          break;

        case "DELETE A ROLE".magenta:
          deleteRole();
          break;

        case "MAIN MENU".red:
          startApp();
          break;
      }
    });
}

function viewAllRoles() {
  db.query(`SELECT * FROM roles`, (err, res) => {
    if (err) throw err;
    console.table(res);
    roleMenu();
  });
}

function addRoles() {
  const sqlDept = `SELECT * FROM departments;`;
  let departmentsArray = [];
  let departmentData = [];
  db.query(sqlDept, (err, res) => {
    if (err) throw err;
    res.forEach((dept) => departmentsArray.push(`${dept.name}`));
  });
  const roleQ = [
    {
      type: "input",
      message: "What is the Role tile?",
      name: "title",
      validate: (input) => {
        if (input) {
          return true;
        } else {
          console.log("What is the Role tile?");
          return false;
        }
      },
    },
    {
      type: "input",
      message: "What is the salary for the new role?",
      name: "salary",
    },
    {
      type: "list",
      message: "Which department is the role in?",
      name: "department",
      choices: departmentsArray,
    },
  ];
  inquirer.prompt(roleQ).then((answer) => {
    let deptId;
    departmentData.forEach((dept) => {
      if (department.name === answer.department) {
        deptId = dept.id;
      }
    });
    db.query(
      `INSERT INTO roles SET ?`,
      {
        title: answer.title,
        department_id: deptId,
        salary: answer.salary,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`ROLE HAS BEEN ADDED SUCCESSFULLY!`.green);
        console.table(answer);
        roleMenu();
      }
    );
  });
}

function deleteRole() {
  const sqlRole = `SELECT * FROM roles;`;
  let rolesArray = [];
  let rolesData = [];
  db.query(sqlRole, (err, res) => {
    if (err) throw err;
    rolesData = res;
    res.forEach((role) => rolesArray.push(`${role.title}`));
  });
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirmDelete",
        message: "Are you sure?",
        default: false,
      },
      {
        type: "list",
        message: "What Role to delete?",
        name: "role",
        when: ({ confirmDelete }) => confirmDelete,
        choices: rolesArray,
      },
    ])
    .then((answer) => {
      db.query(
        `DELETE FROM roles WHERE roles.title = ?`,
        answer.role,
        (err, res) => {
          if (err) {
            throw err;
          } else {
            console.log(`ROLE HAS BEEN REMOVED SUCCESSFULLY!`.green);
            roleMenu();
          }
        }
      );
    });
}
// |||||||||||||||||||||||||||||||| ROLE MENU END ||||||||||||||||||||||||||||||||

module.exports = startApp;

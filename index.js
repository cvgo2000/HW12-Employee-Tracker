const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "EmployeeTracker",
});

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What Task Would You Like To Do?",
        choices: ["View", "Add", "Update", "Delete", "Exit"],
      },
    ])
    .then(({ menu }) => {
      switch (menu) {
        case "View":
          vw();
          break;
        case "Add":
          add();
          break;
        case "Update":
          upd();
          break;
        case "Delete":
          del();
          break;
        default:
          connection.end();
          break;
      }
    });
}

function vw() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "viewType",
        message: "What Would You Like To View?",
        choices: [
          "Departments",
          "Roles",
          "Employees",
          "Employees By Manager",
          "Utilized Budget By Department",
          "Main Menu",
        ],
      },
    ])
    .then(({ viewType }) => {
      switch (viewType) {
        case "Departments":
          departmentView();
          break;
        case "Roles":
          roleView();
          break;
        case "Employees":
          employeeView();
          break;
        case "Employees By Manager":
          employeeByManagerView();
          break;
        case "Utilized Budget By Department":
          utilizedBudgetView();
          break;
        default:
          menu();
          break;
      }
    });
}

function add() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "addType",
        message: "What Would You Like To Add?",
        choices: ["Department", "Role", "Employee", "Main Menu"],
      },
    ])
    .then(({ addType }) => {
      switch (addType) {
        case "Department":
          departmentAdd();
          break;
        case "Role":
          roleAdd();
          break;
        case "Employee":
          employeeAdd();
          break;
        default:
          menu();
          break;
      }
    });
}

function upd() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "updateType",
        message: "What Would You Like To Update?",
        choices: ["Employee Role", "Employee Manager", "Main Menu"],
      },
    ])
    .then(({ updateType }) => {
      switch (updateType) {
        case "Employee Role":
          empRoleUpdate();
          break;
        case "Employee Manager":
          empManagerUpdate();
          break;
        default:
          menu();
      }
    });
}

function del() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deleteType",
        message: "What Would You Like To Delete?",
        choices: ["Department", "Role", "Employee", "Main Menu"],
      },
    ])
    .then(({ deleteType }) => {
      switch (deleteType) {
        case "Department":
          deptDelete();
          break;
        case "Role":
          roleDelete();
          break;
        case "Employee":
          empDelete();
          break;
        default:
          menu();
          break;
      }
    });
}

function departmentView() {
  connection.query(
    "select department.id 'Department ID', department.name 'Department Name', count(DISTINCT role.id) 'Role Count', count(distinct employee.id) 'Employee Count' from department left join role on department.id = role.department_id inner join employee on role.id = employee.role_id group by department.id, department.name;",
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Department Information", res);
      console.log("\n");
      inquirer
        .prompt([
          {
            name: "continue",
            type: "list",
            message:
              "Would You Like to Return to the Main Menu or Continue Searching?",
            choices: ["Main Menu", "Continue Searching"],
          },
        ])
        .then((data) => {
          if (data.continue === "Main Menu") {
            menu();
          } else vw();
        });
    }
  );
}

function roleView() {
  connection.query(
    "select r.id 'Role ID', r.title 'Role Title', r.salary 'Role Salary', IFNULL(count(DISTINCT e.id),0) 'Employees Per Role' from role r left join employee e on r.id = e.role_id group by r.id, r.title, r.salary;",
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Role Information", res);
      console.log("\n");
      inquirer
        .prompt([
          {
            name: "continue",
            type: "list",
            message:
              "Would You Like to Return to the Main Menu or Continue Searching?",
            choices: ["Main Menu", "Continue Searching"],
          },
        ])
        .then((data) => {
          if (data.continue === "Main Menu") {
            menu();
          } else vw();
        });
    }
  );
}

function employeeView() {
  connection.query(
    "select concat(e.first_name, ' ', e.last_name) 'Employee Name', d.name 'Department', r.title 'Role', r.salary 'Salary' ,IFNULL(concat(e2.first_name, ' ', e2.last_name),'None') 'Manager Name' from employee e left join role r on e.role_id = r.id left join department d on r.department_id = d.id left join employee e2 on e.manager_id = e2.id;",
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Employee Information", res);
      console.log("\n");
      inquirer
        .prompt([
          {
            name: "continue",
            type: "list",
            message:
              "Would You Like to Return to the Main Menu or Continue Searching?",
            choices: ["Main Menu", "Continue Searching"],
          },
        ])
        .then((data) => {
          if (data.continue === "Main Menu") {
            menu();
          } else vw();
        });
    }
  );
}

function employeeByManagerView() {
  connection.query(
    "select distinct concat(e2.first_name, ' ', e2.last_name) 'ManagerName' from employee e left join employee e2 on e.manager_id = e2.id where e2.last_name is not null;",
    (err, res) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "supervisor",
            type: "list",
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < res.length; i++) {
                choiceArray.push(res[i].ManagerName);
              }
              return choiceArray;
            },
            message: "What Supervisor's Employees Would You Like to View?",
          },
        ])
        .then(function (answer) {
          let chosenItem;
          for (let i = 0; i < res.length; i++) {
            if (res[i].ManagerName === answer.supervisor) {
              chosenItem = res[i];
            }
          }
          connection.query(
            "select concat(e.first_name, ' ', e.last_name) 'Employee Name', d.name 'Department', r.title 'Title', r.salary 'Salary' from employee e left join role r on e.role_id = r.id left join department d on r.department_id = d.id where manager_id = (select id from employee where CONCAT(first_name, ' ', last_name) = ?)",
            chosenItem.ManagerName,
            (err, res) => {
              if (err) throw err;
              console.log("\n");
              console.table(
                `Employees Supervised by ${chosenItem.ManagerName}`,
                res
              );
              console.log("\n");
              inquirer
                .prompt([
                  {
                    name: "continue",
                    type: "list",
                    message:
                      "Would You Like to Return to the Main Menu or Continue Searching?",
                    choices: ["Main Menu", "Continue Searching"],
                  },
                ])
                .then((data) => {
                  if (data.continue === "Main Menu") {
                    menu();
                  } else vw();
                });
            }
          );
        });
    }
  );
}

function utilizedBudgetView() {
  connection.query(
    "select d.name 'Department', sum(r.salary) 'Utilized Budget' from department d left join role r on d.id = r.department_id group by d.name",
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Budget Utilization Per Department", res);
      console.log("\n");
      inquirer
        .prompt([
          {
            name: "continue",
            type: "list",
            message:
              "Would You Like to Return to the Main Menu or Continue Searching?",
            choices: ["Main Menu", "Continue Searching"],
          },
        ])
        .then((data) => {
          if (data.continue === "Main Menu") {
            menu();
          } else vw();
        });
    }
  );
}

function departmentAdd() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What Department Would You Like to Add?",
      },
    ])
    .then(function (answer) {
      connection.query(
        `Select count(*) DeptCount from department where name = '${answer.department}'`,
        (err, res) => {
          if (err) throw err;
          if (res[0].DeptCount > 0) {
            console.log("Department Already Exists");
            inquirer
              .prompt([
                {
                  name: "continue",
                  type: "list",
                  message:
                    "Would You Like to Return to the Main Menu or Continue Adding?",
                  choices: ["Main Menu", "Continue Adding"],
                },
              ])
              .then((data) => {
                if (data.continue === "Main Menu") {
                  menu();
                } else add();
              });
          } else {
            connection.query(
              `insert into department (name) VALUES ('${answer.department}')`
            ),
              console.log(`${answer.department} Has Been Added`);
            inquirer
              .prompt([
                {
                  name: "continue",
                  type: "list",
                  message:
                    "Would You Like to Return to the Main Menu or Continue Adding?",
                  choices: ["Main Menu", "Continue Adding"],
                },
              ])
              .then((data) => {
                if (data.continue === "Main Menu") {
                  menu();
                } else add();
              });
          }
        }
      );
    });
}

function roleAdd() {}

function employeeAdd() {}

function empRoleUpdate() {
  connection.query(
    "select CONCAT(first_name, ' ', last_name) EmployeeName from employee;",
    (err, res) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            choices: function () {
              let empArray = [];
              for (let i = 0; i < res.length; i++) {
                empArray.push(res[i].EmployeeName);
              }
              return empArray;
            },
            message: "What Employee's Manager Would You Like to Update?",
          },
        ])
        .then(function (answer) {
          let empName;
          for (let i = 0; i < res.length; i++) {
            if (res[i].EmployeeName === answer.employee) {
              empName = res[i];
            }
          }
          connection.query("select title from role;", (err, res) => {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: "role",
                  type: "list",
                  choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < res.length; i++) {
                      choiceArray.push(res[i].title);
                    }
                    return choiceArray;
                  },
                  message: "What Is the Employee's New Role?",
                },
              ])
              .then(function (answer) {
                let roleName;
                for (let i = 0; i < res.length; i++) {
                  if (res[i].title === answer.role) {
                    roleName = res[i];
                  }
                }
                connection.query(
                  `update employee set role_id = (select id from role where title = '${roleName.title}') where CONCAT(first_name, ' ', last_name) = '${empName.EmployeeName}'`,
                  (err, res) => {
                    if (err) throw err;
                    console.log(
                      `${empName.EmployeeName}'s Role Has Been Update to ${roleName.title}`
                    );
                    console.log("\n");
                    inquirer
                      .prompt([
                        {
                          name: "continue",
                          type: "list",
                          message:
                            "Would You Like to Return to the Main Menu or Continue Updating?",
                          choices: ["Main Menu", "Continue Updating"],
                        },
                      ])
                      .then((data) => {
                        if (data.continue === "Main Menu") {
                          menu();
                        } else upd();
                      });
                  }
                );
              });
          });
        });
    }
  );
}

function empManagerUpdate() {
  connection.query(
    "select CONCAT(first_name, ' ', last_name) EmployeeName from employee;",
    (err, res) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            choices: function () {
              let empArray = [];
              for (let i = 0; i < res.length; i++) {
                empArray.push(res[i].EmployeeName);
              }
              return empArray;
            },
            message: "What Employee's Manager Would You Like to Update?",
          },
        ])
        .then(function (answer) {
          let empName;
          for (let i = 0; i < res.length; i++) {
            if (res[i].EmployeeName === answer.employee) {
              empName = res[i];
            }
          }
          connection.query(
            "select CONCAT(first_name, ' ', last_name) ManagerName from employee;",
            (err, res) => {
              if (err) throw err;
              inquirer
                .prompt([
                  {
                    name: "manager",
                    type: "list",
                    choices: function () {
                      let choiceArray = [];
                      for (let i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].ManagerName);
                      }
                      return choiceArray;
                    },
                    message: "Who Is the Employee's New Manager?",
                  },
                ])
                .then(function (answer) {
                  let manName;
                  for (let i = 0; i < res.length; i++) {
                    if (res[i].ManagerName === answer.manager) {
                      manName = res[i];
                    }
                  }
                  connection.query(
                    `with manager (id) as (select id from employee where CONCAT(first_name, ' ', last_name) = '${manName.ManagerName}') update employee set manager_id = (select id from manager) where concat(first_name, ' ', last_name) = '${empName.EmployeeName}'`,
                    (err, res) => {
                      if (err) throw err;
                      console.log(
                        `${empName.EmployeeName}'s Manager Has Been Update to ${manName.ManagerName}`
                      );
                      console.log("\n");
                      inquirer
                        .prompt([
                          {
                            name: "continue",
                            type: "list",
                            message:
                              "Would You Like to Return to the Main Menu or Continue Updating?",
                            choices: ["Main Menu", "Continue Updating"],
                          },
                        ])
                        .then((data) => {
                          if (data.continue === "Main Menu") {
                            menu();
                          } else upd();
                        });
                    }
                  );
                });
            }
          );
        });
    }
  );
}

function deptDelete() {
  connection.query("select name from department;", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < res.length; i++) {
              choiceArray.push(res[i].name);
            }
            return choiceArray;
          },
          message: "What Department Would You Like to Delete?",
        },
      ])
      .then(function (answer) {
        let chosenItem;
        for (let i = 0; i < res.length; i++) {
          if (res[i].name === answer.department) {
            chosenItem = res[i];
          }
        }
        connection.query(
          "delete from department d where d.name = ?",
          chosenItem.name,
          (err, res) => {
            if (err) throw err;
            console.log(`${chosenItem.name} Has Been Deleted`);
            console.log("\n");
            inquirer
              .prompt([
                {
                  name: "continue",
                  type: "list",
                  message:
                    "Would You Like to Return to the Main Menu or Continue Deleting?",
                  choices: ["Main Menu", "Continue Deleting"],
                },
              ])
              .then((data) => {
                if (data.continue === "Main Menu") {
                  menu();
                } else del();
              });
          }
        );
      });
  });
}

function roleDelete() {
  connection.query("select title from role;", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < res.length; i++) {
              choiceArray.push(res[i].title);
            }
            return choiceArray;
          },
          message: "What Role Would You Like to Delete?",
        },
      ])
      .then(function (answer) {
        let chosenItem;
        for (let i = 0; i < res.length; i++) {
          if (res[i].title === answer.role) {
            chosenItem = res[i];
          }
        }
        connection.query(
          "delete from role r where r.title = ?",
          chosenItem.title,
          (err, res) => {
            if (err) throw err;
            console.log(`${chosenItem.title} Has Been Deleted`);
            console.log("\n");
            inquirer
              .prompt([
                {
                  name: "continue",
                  type: "list",
                  message:
                    "Would You Like to Return to the Main Menu or Continue Deleting?",
                  choices: ["Main Menu", "Continue Deleting"],
                },
              ])
              .then((data) => {
                if (data.continue === "Main Menu") {
                  menu();
                } else del();
              });
          }
        );
      });
  });
}

function empDelete() {
  connection.query(
    "select CONCAT(first_name, ' ', last_name) EmployeeName from employee;",
    (err, res) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < res.length; i++) {
                choiceArray.push(res[i].EmployeeName);
              }
              return choiceArray;
            },
            message: "What Employee Would You Like to Delete?",
          },
        ])
        .then(function (answer) {
          let chosenItem;
          for (let i = 0; i < res.length; i++) {
            if (res[i].EmployeeName === answer.employee) {
              chosenItem = res[i];
            }
          }
          connection.query(
            "delete from employee  where concat(first_name, ' ', last_name) = ?",
            chosenItem.EmployeeName,
            (err, res) => {
              if (err) throw err;
              console.log(`${chosenItem.EmployeeName} Has Been Deleted`);
              console.log("\n");
              inquirer
                .prompt([
                  {
                    name: "continue",
                    type: "list",
                    message:
                      "Would You Like to Return to the Main Menu or Continue Deleting?",
                    choices: ["Main Menu", "Continue Deleting"],
                  },
                ])
                .then((data) => {
                  if (data.continue === "Main Menu") {
                    menu();
                  } else del();
                });
            }
          );
        });
    }
  );
}

connection.connect((err) => {
  if (err) throw err;
  console.log("You Are Connected To The Employee Tracker App");
  menu();
});
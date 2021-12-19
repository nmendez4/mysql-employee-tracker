// requirements
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

// mysql connection 
// lists the port, username, password and database being used for the employee tracker
const connection = mysql.createConnection({
    host: "localhost",
    PORT: 3001,
    user: "root",
    password: "Bailey123!",
    database: "employee_db"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝
    `)
    firstPrompt();
});

// function to prompt the employee tracker
function firstPrompt() {

    inquirer
    .prompt({
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View employees by department",
            "Add employee",
            "Remove employee",
            "Update employee role",
            "Add role",
            "Exit/end"
        ]
    })
    .then(function ({task}) {
        switch (task) {
            case "View all employees":
                viewEmployee();
                break;

            case "View employees by department":
                viewEmployeeDepartment();
                break;

            case "Add employee":
                addEmployee();
                break;

            case "Remove employee":
                removeEmployee();
                break;

            case "Update employee role":
                updateEmployee();
                break;

            case "Add role":
                addRole();
                break;

            case "Exit/end":
                connection.end();
                break;
        }
    });
    
}

// View Employees
function viewEmployee() {
    console.log('Viewing Employees\n');

    var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
        ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;
        
        console.table(res);
        console.log("Employees viewed!\n");

        firstPrompt();
    });
}

//View employees by department
function viewEmployeeDepartment() {
    console.log("Viewing employees by department\n");

    var query = 
        `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(data => ({
            value: data.id, name: data.name
        }));

        console.table(res);
        console.log("Department view successful!\n");

        promptDepartment(departmentChoices);
    });
}

function promptDepartment(departmentChoices) {

    inquirer
    .prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to view?",
            choices: departmentChoices
        }
    ])
    .then(function (answer) {
        console.log("answer ", answer.departmentId);

        var query = 
            `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
        FROM employee e
        JOIN role r
            ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        WHERE d.id = ?`

        connection.query(query, answer.departmentId, function (err, res) {
            if (err) throw err;

            console.table("response ", res);
            console.log(res.affectedRows + "Employees now being viewed!\n");

            firstPrompt();
        });
    });
}

// make employee array
function addEmployee() {
    console.log("Inserting an employee!");

    var query =
    `SELECT r.id, r.title, r.salary
      FROM role r`

    connection.query(query, function(err, res) {
        if (err) throw err;

        const roleChoice = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log("RoleToInsert!");

        promptInsert(roleChoice);
    });
}

function promptInsert(roleChoice) {

    inquirer
    .prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoice
        },
    ])
    .then(function (answer) {
        console.log(answer);
  
        var query = `INSERT INTO employee SET ?`
        // when prompt is finished, insert new item in database with said info
        connection.query(query,
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.roleId,
            manager_id: answer.managerId,
          },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log(res.insertedRows + "Inserted successfully!\n");
  
            firstPrompt();
          });
      });
}

// "Remove employee(s)" delete form
// make employee array to delete
function removeEmployee() {
    console.log("Deleting an employee!");

    var query =
    `SELECT e.id, e.first_name, e.last_name
        FROM employee e`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("ArrayToDelete!\n")

        promptDelete(deleteEmployeeChoices);
    });
}

// user specifies employee list, then said employee is deleted
function promptDelete(deleteEmployeeChoices) {

    inquirer
    .prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to remove?",
            choices: deleteEmployeeChoices
        }
    ])
    .then(function (answer) {

        var query = `DELETE FROM employee WHERE ?`;
        // when finished prompting, insert a new item into the database with said info
        connection.query(query, { id: answer.employeeId }, function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log(res.affectedRows + "Deleted!\n");

            firstPrompt();
        });
    });
}

// update employee role
function updateEmployee() {
    employeeArray();

}

function employeeArray() {
    console.log("Updating an employee");

    var query = 
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
        ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
        ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name}) => ({
        value: id, name: `${first_name} ${last_name}`
    }));

        console.table(res);
        console.log("employeeArray To Update!\n");

        roleArray(employeeChoices);
    });
}

function roleArray(employeeChoices) {
    console.log("Updating a role!");

    var query = 
    `SELECT r.id, r.title, r.salary
    FROM role r`
    let roleChoices;

    connection.query(query, function (err, res) {
        if (err) throw err;

        roleChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log("roleArray to update!\n");

        promptEmployeeRole(employeeChoices, roleChoices);
    });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

    inquirer
    .prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to set with this role?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "roleId",
            message: "Which role would you like to update?",
            choices: roleChoices
        },
    ])
    .then(function (answer) {
        var query = `UPDATE employee SET role_id = ? WHERE id = ?`
        // when finished prompting, insert new item into database with said info
        connection.query(query,
            [ 
                answer.roleId,
                answer.employeeId
            ],
            function (err, res) {
                if (err) throw err;

                console.table(res);
                console.log(res.affectedRows + "Updated successfully!");

                firstPrompt();
            });
    });
}

// Add role, create and insert info
function addRole() {
    var query = 
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(({ id, name }) => ({
            value: id, name: `${id} ${name}`
        }));

        console.table(res);
        console.log("Department array");

        promptAddRole(departmentChoices)
    });
}

function promptAddRole(departmentChoices) {

    inquirer
    .prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "Role title?"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "Role salary?"
        },
        {
            type: "list",
            name: "departmentId",
            message: "Department?",
            choices: departmentChoices
        },
    ])
    .then(function (answer) {
        
        var query = `INSERT INTO role SET ?`

        connection.query(query, {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        },
        function(err, res) {
            if (err) throw err;

            console.table(res);
            console.log("Role inserted!");

            firstPrompt();
        });
    });
};
// requirements
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

// mysql connection 
// lists the port, username, password and database being used for the employee tracker
const connection = mysql.createConnection({
    host: 'localhost',
    PORT: 3001,
    user: 'root',
    password: 'Bailey123!',
    database: 'employee_db'
});


connection.connect(function (err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
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
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, COONCAT(m.first_name, ' ', m.last_name) AS manager
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
        ON r.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoice = res.map(data => ({
            value: data.id, name: data.name
        }));

        console.table(res);
        console.log("Department view successful!\n");

        promptDepartment(departmentChoice);
    });
}

function promptDepartment(departmentChoice) {

    inquirer
    .prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to view?",
            choices: departmentChoice
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
        WHERE d.id =?`

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

        var query = ``
    })
}
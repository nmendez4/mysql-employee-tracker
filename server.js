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


const db = require("./assets/js/connection");
const inquirer = require('inquirer');

const select = `SELECT e.id, e.first_name, e.last_name, r.title, d.department, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager_name
FROM ((employee e
INNER JOIN role r ON e.role_id = r.id)
INNER JOIN department d ON r.department_id = d.id)
LEFT JOIN
employee m ON e.manager_id = m.id ORDER BY id ASC;`

const questions = [
    {
        type: 'list',
        name: 'main',
        message: 'What would you like to do ?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
    }
];

init();

async function init() {
    const { main } = await inquirer.prompt(questions);
    switch (main) {
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateRole();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'View All Departments':
            viewDepartments();
            break;
        case 'Add Department':
            addDepartment();
            break;
        default:
            break;
    }
}

async function viewEmployees() {
    let query = await db.query(select);
    const [data] = query;
    console.table(data);
    init();
};

async function addEmployee() {
    let query = await db.query(select);

    const [data] = query;
    
    const eNames = data.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    const jRole = data.map(role =>({
        name: `${role.title}`,
        value: role.id,
    }))

    const add = await inquirer.prompt([
        {
            name: "fName",
            type: "input",
            message: "What is the employee's first name?",
        },
        {
            name: "lName",
            type: "input",
            message: "What is the employee's last name?",
        },
        {
            name: "role",
            type: "list",
            message: "What is employee's role?",
            choices: jRole,
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: eNames,
        }

    ])
};
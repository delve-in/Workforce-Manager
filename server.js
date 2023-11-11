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

async function executeQuery(sql, values){
    return new Promise(async (resolve, reject) => {
        try{
          const result = await db.query(sql, values);
          resolve(result);
        } catch (err) {
            console.error('Database query error', err);
            reject(err);
        }
    });
}

async function viewEmployees() {
    let query = await db.query(select);
    const [data] = query;
    console.table(data);
    init();
};

async function viewRoles() {
    let query = await db.query(`SELECT employee.id, role.title, department.department, role.salary 
                                FROM ((employee
                                INNER JOIN role ON employee.role_id = role.id)
                                INNER JOIN department ON role.department_id = department.id) ORDER BY id ASC;`);
    const [data] = query;
    console.table(data) 
    init();
}

async function viewDepartments() {
    let query = await db.query(`SELECT * 
                                FROM department
                                ORDER BY id ASC;`);
    const [data] = query;
    console.table(data) 
    init();
}

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

    await executeQuery(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?);`,
        [add.fName, add.lName, add.role, add.manager])
        .then(()=> {
            console.log(`Added ${add.fName} ${add.lName} to the database`);
            return init();
        })
        .catch((err)=> { 
            console.log ('Failed to add employee');
        });
}

async function updateRole() {
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
            name: "role",
            type: "list",
            message: "Which role do you want to assign the selected employee ?",
            choices: jRole,
        },
        {
            name: "employee",
            type: "list",
            message: "Which employee's role do you want to update?",
            choices: eNames,
        }
    ])

    await executeQuery(
        `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?;`,
        [add.role, add.employee])
        .then(()=> {
            console.log(`Updated employee's role`);
            return init();
        })
        .catch((err)=> { 
            console.log ('Failed to add employee');
        });
}

async function addRole () {

}

async function addDepartment() {

}
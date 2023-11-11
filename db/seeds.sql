INSERT INTO department(department)
VALUES ("Engineering"),
("Finance"),
("Legal"),
("Sales");

INSERT INTO role(title, salary, department_id)
VALUES ('Sales Lead', 100000, 4),
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Doe", 1,NULL),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 3,NULL),
("Kevin", "Tupik", 4, 3),
("Kunal", "Singh", 5,NULL),
("Malia", "Brown", 6, 5),
("Sarah", "Lourd", 7,NULL),
("Tom", "Allen", 8, 7);

DELETE FROM employee WHERE id = 10;

SELECT employee.id, role.title, department.department, role.salary 
FROM ((employee
INNER JOIN role ON employee.role_id = role.id)
INNER JOIN department ON role.department_id = department.id) ORDER BY id ASC;
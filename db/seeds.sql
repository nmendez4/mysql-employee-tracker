USE employee_db;

INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Legal");
INSERT INTO department (name)
VALUE ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 120000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Head Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 125000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team", 200000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 150000, 4)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Peter", "Parker", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tony", "Stark", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Nick", "Fury", 3, null)
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bruce", "Banner", 2, 2)
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Natasha", "Romanov", 3, 3)
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Pepper", "Potts", 4, null)
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "Rogers", 1, null)
CREATE DATABASE IF NOT EXISTS EmployeeTracker;
USE EmployeeTracker;
CREATE TABLE department (
  id int AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);
CREATE TABLE role (
  id int AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(10, 2),
  department_id INT
);
create TABLE employee (
  id int AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR (30),
  role_id int,
  manager_id int
);
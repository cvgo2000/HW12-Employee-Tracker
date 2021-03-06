USE EmployeeTracker;
INSERT INTO
  department (name)
VALUES
  ("Executive"),
  ("Sales"),
  ("eCommerce"),
  ("IT"),
  ("Marketing");
INSERT INTO
  role (title, salary, department_id)
VALUES
  ("CEO", 1500000, 1),
  ("VP of Sales", 400000, 2),
  ("eCommerce Manager", 250000, 3),
  ("CTO", 450000, 4),
  ("VP of Marketing", 300000, 5),
  ("eCommerce Supervisor", 100000, 3),
  ("Web Designer", 75000, 3),
  ("DBA", 95000, 4),
  ("Lead Developer", 120000, 4),
  ("SysAdmin", 90000, 4),
  ("Lead Salesman", 60000, 2),
  ("Sales Analysis", 52000, 2),
  ("Marketing Supervisor", 82000, 5),
  ("Marketing Analysis", 54000, 5);
INSERT INTO
  employee (first_name, last_name, manager_id, role_id)
VALUES
  ("John", "Smith", null, 1),
  ("Barbara", "Jones", 1, 2),
  ("Leah", "Johnson", 1, 3),
  ("Victor", "Dylan", 1, 4),
  ("Mary", "Adams", 1, 5),
  ("Dave", "Hayter", 1, 6),
  ("Wayne", "Gretzky", 3, 7),
  ("David", "Dobbins", 4, 8),
  ("Dylan", "Evans", 4, 9),
  ("Sean", "Fox", 4, 10),
  ("Michelle", "Obama", 2, 11),
  ("Ryan", "Sando", 2, 12),
  ("Julio", "Iglesias", 5, 13),
  ("Ryan", "Johnson", 5, 14);
# MySQL Complete Course

A full reference — database & table management, queries, joins, functions, indexes, transactions, stored procedures, triggers, views, and user management, all with examples.

---

## 1. Getting Started

```bash
mysql -u root -p                    # connect to MySQL shell
mysql -u root -p -h localhost -P 3306
```

```sql
SHOW DATABASES;
CREATE DATABASE company;
USE company;
DROP DATABASE company;

SHOW TABLES;
SELECT VERSION();
SELECT DATABASE();                    -- current database in use
```

---

## 2. Data Types

```sql
-- Numeric
INT, TINYINT, SMALLINT, MEDIUMINT, BIGINT
DECIMAL(10,2)      -- fixed-point, exact (use for money)
FLOAT, DOUBLE        -- floating point, approximate
BOOLEAN               -- alias for TINYINT(1)

-- String
CHAR(10)              -- fixed-length
VARCHAR(255)          -- variable-length, must specify max
TEXT, MEDIUMTEXT, LONGTEXT   -- large text blocks
ENUM('small','medium','large')  -- one of a predefined set
SET('read','write','execute')    -- zero or more from a predefined set

-- Date/Time
DATE                  -- 'YYYY-MM-DD'
DATETIME              -- 'YYYY-MM-DD HH:MM:SS'
TIMESTAMP             -- like DATETIME, but timezone-aware & auto-updatable
TIME                    -- 'HH:MM:SS'
YEAR                     -- 'YYYY'

-- Other
JSON                   -- store JSON documents
BLOB                     -- binary data (images, files)
```

---

## 3. Creating & Modifying Tables (DDL)

### 3.1 CREATE TABLE

```sql
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  salary DECIMAL(10,2) DEFAULT 0.00,
  department_id INT,
  hire_date DATE DEFAULT (CURRENT_DATE),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);
```

**Constraints:**
```sql
NOT NULL             -- value required
UNIQUE                 -- no duplicate values
PRIMARY KEY             -- unique identifier for row (implies NOT NULL + UNIQUE)
FOREIGN KEY             -- references another table's key
DEFAULT value            -- fallback value if none provided
CHECK (salary > 0)        -- custom validation rule (MySQL 8.0.16+)
AUTO_INCREMENT             -- auto-generates sequential integer
```

### 3.2 ALTER TABLE

```sql
ALTER TABLE employees ADD COLUMN phone VARCHAR(20);
ALTER TABLE employees DROP COLUMN phone;
ALTER TABLE employees MODIFY COLUMN salary DECIMAL(12,2);
ALTER TABLE employees CHANGE COLUMN salary annual_salary DECIMAL(12,2); -- rename + retype
ALTER TABLE employees RENAME COLUMN annual_salary TO salary;
ALTER TABLE employees RENAME TO staff;
ALTER TABLE employees ADD CONSTRAINT chk_salary CHECK (salary >= 0);
ALTER TABLE employees ADD INDEX idx_lastname (last_name);
ALTER TABLE employees DROP INDEX idx_lastname;
ALTER TABLE employees ADD FOREIGN KEY (department_id) REFERENCES departments(id);
```

### 3.3 DROP / TRUNCATE

```sql
DROP TABLE employees;               -- deletes table + structure
TRUNCATE TABLE employees;            -- deletes all rows, keeps structure, resets AUTO_INCREMENT
DROP TABLE IF EXISTS employees;
```

---

## 4. Inserting, Updating, Deleting Data (DML)

### 4.1 INSERT

```sql
INSERT INTO employees (first_name, last_name, email, salary, department_id)
VALUES ('John', 'Doe', 'john@company.com', 55000, 1);

-- Multiple rows in one statement
INSERT INTO employees (first_name, last_name, email, salary)
VALUES
  ('Jane', 'Smith', 'jane@company.com', 60000),
  ('Bob', 'Lee', 'bob@company.com', 58000);

-- Insert from another table (copy data)
INSERT INTO archived_employees SELECT * FROM employees WHERE is_active = FALSE;

-- Insert with ON DUPLICATE KEY UPDATE (upsert)
INSERT INTO employees (id, email, salary) VALUES (1, 'john@company.com', 60000)
ON DUPLICATE KEY UPDATE salary = VALUES(salary);
```

### 4.2 UPDATE

```sql
UPDATE employees SET salary = 65000 WHERE id = 1;
UPDATE employees SET salary = salary * 1.10 WHERE department_id = 2;   -- 10% raise
UPDATE employees SET is_active = FALSE WHERE hire_date < '2015-01-01';

-- ALWAYS use WHERE, or every row gets updated!
```

### 4.3 DELETE

```sql
DELETE FROM employees WHERE id = 5;
DELETE FROM employees WHERE is_active = FALSE;
DELETE FROM employees;    -- deletes ALL rows (careful!) — TRUNCATE is faster for full wipe
```

---

## 5. Querying Data (SELECT)

### 5.1 Basics

```sql
SELECT * FROM employees;
SELECT first_name, last_name FROM employees;
SELECT first_name AS "First Name", salary AS pay FROM employees;   -- aliasing
SELECT DISTINCT department_id FROM employees;                        -- unique values

SELECT * FROM employees WHERE salary > 50000;
SELECT * FROM employees WHERE department_id = 1 AND is_active = TRUE;
SELECT * FROM employees WHERE department_id = 1 OR department_id = 2;
SELECT * FROM employees WHERE department_id IN (1, 2, 3);
SELECT * FROM employees WHERE department_id NOT IN (1, 2);
SELECT * FROM employees WHERE salary BETWEEN 40000 AND 70000;
SELECT * FROM employees WHERE email LIKE '%@gmail.com';    -- % = any chars
SELECT * FROM employees WHERE first_name LIKE 'J_n';         -- _ = single char
SELECT * FROM employees WHERE department_id IS NULL;
SELECT * FROM employees WHERE department_id IS NOT NULL;
SELECT * FROM employees WHERE NOT is_active;
```

### 5.2 Sorting & Limiting

```sql
SELECT * FROM employees ORDER BY salary DESC;
SELECT * FROM employees ORDER BY department_id ASC, salary DESC;   -- multi-column sort
SELECT * FROM employees LIMIT 10;                    -- first 10 rows
SELECT * FROM employees LIMIT 10 OFFSET 20;          -- pagination: skip 20, take 10
SELECT * FROM employees ORDER BY hire_date DESC LIMIT 5;  -- 5 most recently hired
```

### 5.3 Aggregate Functions

```sql
SELECT COUNT(*) FROM employees;
SELECT COUNT(DISTINCT department_id) FROM employees;
SELECT SUM(salary) FROM employees;
SELECT AVG(salary) FROM employees;
SELECT MIN(salary), MAX(salary) FROM employees;
SELECT ROUND(AVG(salary), 2) AS avg_salary FROM employees;
```

### 5.4 GROUP BY & HAVING

```sql
-- GROUP BY: aggregate per group
SELECT department_id, COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id;

-- HAVING filters groups (WHERE filters rows BEFORE grouping, HAVING filters AFTER)
SELECT department_id, COUNT(*) AS emp_count
FROM employees
GROUP BY department_id
HAVING emp_count > 5;

SELECT department_id, AVG(salary) AS avg_salary
FROM employees
WHERE is_active = TRUE
GROUP BY department_id
HAVING avg_salary > 55000
ORDER BY avg_salary DESC;

-- WITH ROLLUP — adds summary rows
SELECT department_id, SUM(salary) FROM employees GROUP BY department_id WITH ROLLUP;
```

---

## 6. Joins

Sample tables:
```sql
-- employees: id, first_name, department_id
-- departments: id, name
```

```sql
-- INNER JOIN — only matching rows in both tables
SELECT e.first_name, d.name AS department
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- LEFT JOIN — all rows from left table, matched rows from right (NULL if no match)
SELECT e.first_name, d.name AS department
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;

-- RIGHT JOIN — all rows from right table, matched rows from left
SELECT e.first_name, d.name AS department
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id;

-- FULL OUTER JOIN — MySQL doesn't support natively; simulate with UNION
SELECT e.first_name, d.name FROM employees e LEFT JOIN departments d ON e.department_id = d.id
UNION
SELECT e.first_name, d.name FROM employees e RIGHT JOIN departments d ON e.department_id = d.id;

-- CROSS JOIN — cartesian product (every row x every row)
SELECT e.first_name, d.name FROM employees e CROSS JOIN departments d;

-- Self join — join a table to itself (e.g. employees + their manager)
SELECT e.first_name AS employee, m.first_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Joining 3+ tables
SELECT e.first_name, d.name AS department, p.title AS project
FROM employees e
JOIN departments d ON e.department_id = d.id
JOIN projects p ON p.department_id = d.id;
```

---

## 7. Subqueries

```sql
-- Subquery in WHERE
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Subquery with IN
SELECT * FROM employees
WHERE department_id IN (SELECT id FROM departments WHERE name = 'Engineering');

-- Correlated subquery (references outer query, runs per row)
SELECT e.first_name, e.salary
FROM employees e
WHERE e.salary > (
  SELECT AVG(salary) FROM employees WHERE department_id = e.department_id
);

-- Subquery in FROM (derived table) — must be aliased
SELECT dept_avg.department_id, dept_avg.avg_salary
FROM (
  SELECT department_id, AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department_id
) AS dept_avg
WHERE dept_avg.avg_salary > 50000;

-- EXISTS / NOT EXISTS
SELECT * FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.id);

SELECT * FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.id);

-- Scalar subquery in SELECT
SELECT first_name,
  (SELECT name FROM departments WHERE id = e.department_id) AS dept_name
FROM employees e;
```

---

## 8. Common Functions

### 8.1 String Functions

```sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees;
SELECT UPPER(first_name), LOWER(last_name) FROM employees;
SELECT LENGTH(email) FROM employees;
SELECT TRIM('  hello  ');                     -- "hello"
SELECT SUBSTRING(email, 1, 5);                 -- first 5 chars
SELECT REPLACE(email, '@gmail.com', '@work.com');
SELECT LEFT(first_name, 3), RIGHT(first_name, 3);
SELECT LPAD(id, 5, '0');                        -- "00001"
SELECT CONCAT_WS('-', '2024', '01', '15');       -- "2024-01-15" (with separator)
```

### 8.2 Numeric Functions

```sql
SELECT ROUND(salary, 2), CEIL(salary), FLOOR(salary) FROM employees;
SELECT ABS(-15);                       -- 15
SELECT MOD(10, 3);                      -- 1
SELECT POWER(2, 10);                      -- 1024
SELECT SQRT(16);                            -- 4
```

### 8.3 Date Functions

```sql
SELECT NOW();                                -- current datetime
SELECT CURDATE();                              -- current date
SELECT CURTIME();                                -- current time
SELECT YEAR(hire_date), MONTH(hire_date), DAY(hire_date) FROM employees;
SELECT DATEDIFF(NOW(), hire_date) AS days_employed FROM employees;
SELECT DATE_ADD(hire_date, INTERVAL 1 YEAR) FROM employees;
SELECT DATE_SUB(NOW(), INTERVAL 30 DAY);
SELECT DATE_FORMAT(hire_date, '%W, %M %d, %Y') FROM employees;  -- "Monday, January 15, 2024"
SELECT * FROM employees WHERE hire_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### 8.4 Conditional Functions

```sql
-- IF(condition, true_value, false_value)
SELECT first_name, IF(salary > 60000, 'High', 'Standard') AS tier FROM employees;

-- CASE WHEN (like switch statement)
SELECT first_name, salary,
  CASE
    WHEN salary >= 70000 THEN 'Senior'
    WHEN salary >= 50000 THEN 'Mid'
    ELSE 'Junior'
  END AS level
FROM employees;

-- NULL handling
SELECT IFNULL(department_id, 0) FROM employees;         -- replace NULL with fallback
SELECT COALESCE(phone, email, 'No contact') FROM employees; -- first non-null value
SELECT NULLIF(salary, 0);                                    -- returns NULL if equal
```

---

## 9. Indexes

Indexes speed up lookups on large tables at the cost of extra storage and slower writes.

```sql
CREATE INDEX idx_email ON employees(email);
CREATE UNIQUE INDEX idx_unique_email ON employees(email);
CREATE INDEX idx_dept_salary ON employees(department_id, salary);   -- composite index

SHOW INDEX FROM employees;
DROP INDEX idx_email ON employees;

-- EXPLAIN — see how MySQL executes a query (check if indexes are used)
EXPLAIN SELECT * FROM employees WHERE email = 'john@company.com';
```
**When to index:** columns frequently used in `WHERE`, `JOIN`, and `ORDER BY`. Avoid over-indexing — each index slows down `INSERT`/`UPDATE`/`DELETE`.

---

## 10. Constraints & Relationships Recap

```sql
-- One-to-Many: departments (1) -> employees (many)
CREATE TABLE departments (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100));
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Many-to-Many: students <-> courses, via a junction table
CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(100));
CREATE TABLE courses (id INT PRIMARY KEY, title VARCHAR(100));
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  enrolled_on DATE,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- One-to-One: users <-> user_profiles
CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY,
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**ON DELETE / ON UPDATE options:**
```sql
ON DELETE CASCADE      -- delete child rows when parent is deleted
ON DELETE SET NULL      -- set FK to NULL when parent is deleted
ON DELETE RESTRICT       -- prevent deletion of parent if children exist (default)
ON DELETE NO ACTION        -- similar to RESTRICT
```

---

## 11. Transactions

Transactions ensure a group of statements either **all succeed** or **all fail** (ACID compliance).

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- withdraw
UPDATE accounts SET balance = balance + 100 WHERE id = 2;   -- deposit

COMMIT;    -- save changes permanently
-- or
ROLLBACK;  -- undo everything since START TRANSACTION

-- Savepoints (partial rollback)
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT before_deposit;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
ROLLBACK TO before_deposit;  -- undo only the deposit, keep the withdrawal
COMMIT;

-- Isolation levels
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- Options: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ (MySQL default), SERIALIZABLE
```

---

## 12. Views

A view is a saved, reusable query that acts like a virtual table.

```sql
CREATE VIEW active_employees AS
SELECT id, first_name, last_name, salary
FROM employees
WHERE is_active = TRUE;

SELECT * FROM active_employees WHERE salary > 50000;   -- query it like a table

CREATE OR REPLACE VIEW active_employees AS
SELECT id, first_name, last_name, salary, department_id
FROM employees
WHERE is_active = TRUE;

DROP VIEW active_employees;
```
**Use cases:** simplify complex/repeated joins, restrict column access for security, present a stable interface over changing schemas.

---

## 13. Stored Procedures & Functions

### 13.1 Stored Procedures

```sql
DELIMITER //

CREATE PROCEDURE GetEmployeesByDept(IN dept_id INT)
BEGIN
  SELECT * FROM employees WHERE department_id = dept_id;
END //

DELIMITER ;

CALL GetEmployeesByDept(1);

-- With OUT parameter
DELIMITER //
CREATE PROCEDURE GetEmployeeCount(IN dept_id INT, OUT emp_count INT)
BEGIN
  SELECT COUNT(*) INTO emp_count FROM employees WHERE department_id = dept_id;
END //
DELIMITER ;

CALL GetEmployeeCount(1, @count);
SELECT @count;

-- Procedure with logic
DELIMITER //
CREATE PROCEDURE GiveRaise(IN emp_id INT, IN percent DECIMAL(5,2))
BEGIN
  IF percent > 0 AND percent <= 50 THEN
    UPDATE employees SET salary = salary * (1 + percent/100) WHERE id = emp_id;
  ELSE
    SELECT 'Invalid percentage' AS error;
  END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS GetEmployeesByDept;
```

### 13.2 Stored Functions

```sql
DELIMITER //
CREATE FUNCTION GetAnnualSalary(monthly DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  RETURN monthly * 12;
END //
DELIMITER ;

SELECT first_name, GetAnnualSalary(salary/12) FROM employees;
DROP FUNCTION IF EXISTS GetAnnualSalary;
```

---

## 14. Triggers

Triggers automatically run in response to `INSERT`, `UPDATE`, or `DELETE` events.

```sql
CREATE TABLE salary_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  old_salary DECIMAL(10,2),
  new_salary DECIMAL(10,2),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER before_salary_update
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
  IF OLD.salary <> NEW.salary THEN
    INSERT INTO salary_audit (employee_id, old_salary, new_salary)
    VALUES (OLD.id, OLD.salary, NEW.salary);
  END IF;
END //
DELIMITER ;

-- Other trigger timings: BEFORE INSERT, AFTER INSERT, BEFORE DELETE, AFTER DELETE, AFTER UPDATE

SHOW TRIGGERS;
DROP TRIGGER IF EXISTS before_salary_update;
```

---

## 15. User Management & Permissions

```sql
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'securePassword123';
CREATE USER 'appuser'@'%' IDENTIFIED BY 'securePassword123';   -- '%' = any host

GRANT SELECT, INSERT, UPDATE ON company.* TO 'appuser'@'localhost';
GRANT ALL PRIVILEGES ON company.* TO 'appuser'@'localhost';
GRANT SELECT ON company.employees TO 'appuser'@'localhost';       -- table-level

REVOKE INSERT ON company.* FROM 'appuser'@'localhost';

SHOW GRANTS FOR 'appuser'@'localhost';
FLUSH PRIVILEGES;                          -- apply changes immediately

ALTER USER 'appuser'@'localhost' IDENTIFIED BY 'newPassword456';
DROP USER 'appuser'@'localhost';

SELECT user, host FROM mysql.user;         -- list all users
```

---

## 16. Set Operations

```sql
-- UNION — combines results, removes duplicates
SELECT first_name FROM employees
UNION
SELECT first_name FROM contractors;

-- UNION ALL — combines results, keeps duplicates (faster than UNION)
SELECT first_name FROM employees
UNION ALL
SELECT first_name FROM contractors;

-- INTERSECT (MySQL 8.0.31+)
SELECT department_id FROM employees
INTERSECT
SELECT department_id FROM projects;

-- EXCEPT / MINUS (MySQL 8.0.31+) — rows in first query but not second
SELECT id FROM employees
EXCEPT
SELECT employee_id FROM archived_employees;
```

---

## 17. Window Functions (MySQL 8.0+)

Window functions perform calculations across a set of rows **related to the current row**, without collapsing them like `GROUP BY` does.

```sql
-- ROW_NUMBER — unique sequential number per row
SELECT first_name, department_id, salary,
  ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_in_dept
FROM employees;

-- RANK / DENSE_RANK — like ROW_NUMBER but handles ties
SELECT first_name, salary,
  RANK() OVER (ORDER BY salary DESC) AS salary_rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;

-- Running total
SELECT first_name, salary,
  SUM(salary) OVER (ORDER BY id) AS running_total
FROM employees;

-- Compare to previous/next row
SELECT first_name, salary,
  LAG(salary) OVER (ORDER BY id) AS prev_salary,
  LEAD(salary) OVER (ORDER BY id) AS next_salary
FROM employees;

-- Average per partition (without collapsing rows, unlike GROUP BY)
SELECT first_name, department_id, salary,
  AVG(salary) OVER (PARTITION BY department_id) AS dept_avg
FROM employees;

-- Top N per group (common interview/real-world task)
SELECT * FROM (
  SELECT first_name, department_id, salary,
    ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn
  FROM employees
) ranked
WHERE rn <= 3;   -- top 3 earners per department
```

---

## 18. CTEs (Common Table Expressions)

CTEs create a named temporary result set for use within a single query — improves readability over nested subqueries.

```sql
WITH dept_avg AS (
  SELECT department_id, AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department_id
)
SELECT e.first_name, e.salary, d.avg_salary
FROM employees e
JOIN dept_avg d ON e.department_id = d.department_id
WHERE e.salary > d.avg_salary;

-- Multiple CTEs
WITH high_earners AS (
  SELECT * FROM employees WHERE salary > 70000
),
dept_names AS (
  SELECT id, name FROM departments
)
SELECT h.first_name, d.name
FROM high_earners h
JOIN dept_names d ON h.department_id = d.id;

-- Recursive CTE (e.g. org chart / hierarchy traversal)
WITH RECURSIVE org_chart AS (
  SELECT id, first_name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL           -- anchor: top-level (CEO)

  UNION ALL

  SELECT e.id, e.first_name, e.manager_id, oc.level + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY level;
```

---

## 19. Normalization (Quick Reference)

| Form | Rule |
|---|---|
| **1NF** | Each column holds atomic (indivisible) values; no repeating groups |
| **2NF** | 1NF + no partial dependency (non-key columns depend on the WHOLE primary key) |
| **3NF** | 2NF + no transitive dependency (non-key columns depend only on the key, not on other non-key columns) |

```sql
-- Denormalized (bad): department_name repeated in every employee row
-- employees(id, name, department_id, department_name)

-- Normalized (good): department info lives in its own table
-- departments(id, name)
-- employees(id, name, department_id) -> FK to departments.id
```
**Trade-off:** normalization reduces redundancy/anomalies but requires more joins; denormalization can improve read performance at the cost of data duplication (common in reporting/analytics tables).

---

## 20. Performance & Best Practices

```sql
-- Use EXPLAIN to check query plans
EXPLAIN SELECT * FROM employees WHERE department_id = 1;

-- Avoid SELECT * in production code — fetch only needed columns
SELECT id, first_name FROM employees;   -- better than SELECT *

-- Index columns used in WHERE/JOIN/ORDER BY
CREATE INDEX idx_department ON employees(department_id);

-- Use LIMIT for large result sets / pagination
SELECT * FROM employees ORDER BY id LIMIT 20 OFFSET 40;

-- Batch inserts instead of one-by-one
INSERT INTO logs (message) VALUES ('a'), ('b'), ('c');  -- one round-trip instead of three

-- Use prepared statements in application code (prevents SQL injection)
-- e.g. in Node.js with mysql2:
-- connection.execute('SELECT * FROM users WHERE email = ?', [userEmail]);
```

**Never build SQL by string concatenation with user input** — always use parameterized queries/prepared statements to prevent SQL injection.

---

## 21. Backup & Restore

```bash
# Backup (export)
mysqldump -u root -p company > company_backup.sql
mysqldump -u root -p company employees > employees_only.sql   # single table
mysqldump -u root -p --all-databases > all_databases.sql

# Restore (import)
mysql -u root -p company < company_backup.sql
```

---

## 22. Quick Reference Cheat Sheet

| Clause Order (how MySQL logically processes a query) |
|---|
| `FROM` → `JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT` |

| Command | Purpose |
|---|---|
| `SHOW DATABASES / TABLES` | list objects |
| `DESCRIBE table_name` | show table structure |
| `EXPLAIN query` | show query execution plan |
| `SHOW INDEX FROM table` | list indexes |
| `SHOW PROCESSLIST` | list running queries |
| `SHOW CREATE TABLE table_name` | see full DDL for a table |

| Type of statement | Examples |
|---|---|
| DDL (Data Definition) | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| DML (Data Manipulation) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| DCL (Data Control) | `GRANT`, `REVOKE` |
| TCL (Transaction Control) | `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

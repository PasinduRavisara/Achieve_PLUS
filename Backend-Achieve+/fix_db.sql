-- 1. Disable Foreign Key Checks to allow dropping tables with relationships
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop tables to ensure clean slate and no conflicts
use achieveplus;
DROP TABLE IF EXISTS mood_logs;

DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS users;

-- 3. Recreate users table (Order: id, full_name, email, role, password, created_at, updated_at)
CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Employee') NOT NULL,
    points INT DEFAULT 0,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
) ENGINE=InnoDB;

-- 4. Recreate task table (Order: id, title, description, assigned_id, assigned_name, priority, status, points, created_by, due_date, created_at, updated_at)
CREATE TABLE task (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_id BIGINT,
    assigned_name VARCHAR(255),
    priority VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL,
    points INT,
    created_by BIGINT,
    due_date DATE,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    KEY (assigned_id),
    KEY (created_by),
    CONSTRAINT FK_Task_AssignedTo FOREIGN KEY (assigned_id) REFERENCES users (id),
    CONSTRAINT FK_Task_CreatedBy FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE=InnoDB;

-- 5. Re-enable Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;

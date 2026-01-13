-- 1. Disable Foreign Key Checks to allow dropping tables with relationships
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop the mood_logs table (which is no longer used)
DROP TABLE IF EXISTS mood_logs;

-- 3. Drop the users table so we can recreate it with the correct column order
DROP TABLE IF EXISTS users;

-- 4. Recreate the users table with the SPECIFIC COLUMN ORDER requested
CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Employee') NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
) ENGINE=InnoDB;

-- 5. Re-enable Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;

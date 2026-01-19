-- 1. Disable Foreign Key Checks to allow dropping tables with relationships
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop tables to ensure clean slate and no conflicts
use achieveplus;
DROP TABLE IF EXISTS mood_logs;

DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reward;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS community_posts;

-- 3. Recreate users table (Order: id, full_name, role, points, email, password, created_at, updated_at)
CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('Admin', 'Employee') NOT NULL,
    points INT DEFAULT 0,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (email),
    UNIQUE KEY (user_name)
) ENGINE=InnoDB;

-- 4. Recreate task table (Order: id, title, description, assigned_id, assigned_name, priority, status, points, created_by, due_date, created_at, updated_at)
CREATE TABLE task (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_id BIGINT,
    assigned_name VARCHAR(255),
    priority VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE') NOT NULL,
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

-- 5. Recreate reward table (Order: id, name, description, points_cost, quantity, image_url, created_at, updated_at)
-- Note: image_url needs to be LONGTEXT to support both URLs and file paths (and potential Base64 legacy data)
CREATE TABLE reward (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_cost INT NOT NULL,
    quantity INT NOT NULL,
    image_url LONGTEXT,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- 6. Recreate community_posts table
CREATE TABLE community_posts (
    id BIGINT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_CommunityPost_User FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

-- 7. Recreate post_likes table
CREATE TABLE post_likes (
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    KEY (post_id),
    KEY (user_id),
    CONSTRAINT FK_PostLikes_Post FOREIGN KEY (post_id) REFERENCES community_posts (id),
    CONSTRAINT FK_PostLikes_User FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

-- 8. Re-enable Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;

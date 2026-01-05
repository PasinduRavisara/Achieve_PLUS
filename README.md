# Achieve+ Project

## Prerequisites
Before running this project, ensure you have the following installed:
*   **Java Development Kit (JDK) 17** or higher.
*   **Node.js** and **npm**.
*   **MySQL Server** (running on port 3306).

## 🚀 Quick Setup Guide

### 1. Database Setup
1.  Open your MySQL Client (Workbench, Terminal, etc.).
2.  Run the following SQL commands to create the database and user:

```sql
CREATE DATABASE IF NOT EXISTS achieveplus;
CREATE USER IF NOT EXISTS 'achieveUser'@'localhost' IDENTIFIED BY 'apple123';
GRANT ALL PRIVILEGES ON achieveplus.* TO 'achieveUser'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Environment Configuration (Backend)
The backend requires a `.env` file to store sensitive secrets. This file is ignored by Git for security.

1.  Navigate to the `Backend-Achieve+` folder.
2.  Create a new file named `.env`.
3.  Paste the following content into it:

```properties
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_secure_jwt_secret_key_min_256_bits
```
*(Note: You can change these values, but update your Database config to match).*

### 3. Install Dependencies (Frontend)
1.  Open a terminal in the `Frontend -Achieve+` folder.
2.  Run:
    ```bash
    npm install
    ```

---

## ▶️ How to Run

### Option 1: Using VS Code (Recommended)
1.  Open the project in **VS Code**.
2.  Go to the **Run and Debug** tab (Ctrl+Shift+D).
3.  Select **"Run Backend (Spring Boot)"** and press **Play (F5)**.
    *   *This automatically loads your `.env` file and starts the server.*
4.  Open a terminal for the frontend:
    ```bash
    cd "Frontend -Achieve+"
    npm run dev
    ```

### Option 2: Using Terminal

**Backend:**
```bash
cd "Backend-Achieve+"
# You must manually export env vars or use a helper, 
# OR use the VS Code method above which is easier.
.\mvnw spring-boot:run
```
*(Note: Running `mvnw` directly in PowerShell ignores `.env` files unless you manually load them first).*

**Frontend:**
```bash
cd "Frontend -Achieve+"
npm run dev
```

---

##  Ports
*   **Frontend**: http://localhost:5173
*   **Backend**: http://localhost:8080
*   **Database**: Port 3306

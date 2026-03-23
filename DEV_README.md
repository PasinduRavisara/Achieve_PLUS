# 🚀 Achieve+ Developer Guide

Welcome to the **Achieve+** development workspace! This guide will walk you through setting up the project on your local machine so you can start coding right away.

There are two primary ways to run this project: Using **Docker (Recommended)** or **Running Manually**.

---

## 📋 Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Docker & Docker Compose** (Highly Recommended)
- **Git**

*If you plan to run the project manually without Docker, you will also need:*
- **Java 17** (or higher)
- **Node.js** (v18+ recommended) & **npm**
- **MySQL Server** 

---

## 🐋 Method 1: Docker Compose (Recommended & Easiest)

Running the project using Docker eliminates "it works on my machine" issues by automatically orchestrating the Backend, Frontend, and Database inside isolated containers for you.

### Step 1: Set up Environment Variables
1. In the root of the project (`Achieve_PLUS`), locate the `.env.example` file.
2. Make a copy of this file in the same directory and name the new file `.env`.
3. Open your new `.env` file and fill in your desired secure database password and JWT secret. 
*(Note: Docker Compose will automatically use this file, and Git will ignore it to keep your secrets from leaking!)*

### Step 2: Build and Run
1. Open a terminal in the root directory.
2. Run the following command:
   ```bash
   docker compose up --build
   ```
3. Docker will automatically launch MySQL, the Spring Boot Backend, and the Angular Frontend! 

### Step 3: Access the Application
- **Frontend App**: [http://localhost:4200](http://localhost:4200)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)

*(To stop the servers, just press `Ctrl + C` in the terminal.)*

---

## 💻 Method 2: Run Locally (Manual Setup)

If you prefer to run the services directly on your host machine without Docker, follow these steps:

### 1. Database Setup
1. Open your local MySQL client (like MySQL Workbench).
2. Run the following SQL commands to prepare the database and user:
   ```sql
   CREATE DATABASE IF NOT EXISTS achieveplus;
   CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'your_local_password';
   GRANT ALL PRIVILEGES ON achieveplus.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Ensure the `achieveplus` database is empty and ready for Spring Boot to auto-generate tables.

### 2. Backend Setup (Spring Boot)
1. Open a terminal and navigate into the backend directory:
   ```bash
   cd "Backend-Achieve+"
   ```
2. **Important:** Create a `.env` file inside the `Backend-Achieve+` directory and add the following lines (adjust them to match your local MySQL credentials):
   ```properties
   DB_URL=jdbc:mysql://localhost:3306/achieveplus
   DB_USERNAME=root
   DB_PASSWORD=your_local_password
   JWT_SECRET=your_super_secret_jwt_key
   FRONTEND_URL=http://localhost:4200
   ```
3. Run the development server:
   ```bash
   # On Windows
   .\mvnw spring-boot:run
   
   # On Mac/Linux
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup (Angular)
1. Open a **new, separate terminal** and navigate into the frontend folder:
   ```bash
   cd "Frontend -Achieve+"
   ```
2. Install the necessary JavaScript packages:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```

---

## 📂 Project Structure

```text
Achieve_PLUS/
├── Backend-Achieve+/       # Spring Boot Java Backend
│   ├── src/main/java       
│   ├── src/main/resources  
│   └── Dockerfile          
├── Frontend -Achieve+/     # Angular Frontend
│   ├── src/app             
│   ├── package.json        
│   └── Dockerfile          
├── docker-compose.yml      # Docker orchestrator
├── .env.example            # Environment variables template
├── README.md               # General user project information
└── Dev_README.md           # Developer Guide (You are here)
```

## 🐛 Troubleshooting

- **Port Conflicts**: 
  - Backend defaults to `8080`.
  - Frontend defaults to `4200`.
  - Docker's MySQL maps to `3310` externally to prevent clashing with a host MySQL on `3306`.
  - If a port is busy, ensure you stop any other projects using them (or stop background Java/Node processes).
- **CORS Issues**: Ensure the `FRONTEND_URL` in your backend `.env` perfectly matches the URL you use to access the frontend application.

Happy Coding! ☕

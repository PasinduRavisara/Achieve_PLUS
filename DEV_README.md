# 🚀 Getting Started with Achieve+ Development

Welcome to the **Achieve+** developer guide. Follow these instructions to set up your local development environment, configure the database, and run the application.

## 📋 Prerequisites
Ensure you have the following installed on your machine:
- **Java 17** (or higher)
- **Node.js** (v18+ recommended) & **npm**
- **MySQL Server** (running on port `3306`)
- **Git**

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/PasinduRavisara/Achieve_PLUS.git
cd Achieve_PLUS
```

### 2. Database Configuration
1. Open your MySQL Client (Workbench, DBeaver, or Command Line).
2. Create the database and a user with proper privileges. Run the following SQL:

```sql
CREATE DATABASE IF NOT EXISTS achieveplus;
CREATE USER IF NOT EXISTS 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON achieveplus.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```
> **Note:** If you prefer different credentials, remember to update them in the Backend `.env` file later.

---

### 3. Backend Setup (Spring Boot)
The backend requires environment variables to connect to the database and handle security.

1. Navigate to the backend directory:
   ```bash
   cd "Backend-Achieve+"
   ```
2. **Create a `.env` file** in the root of `Backend-Achieve+`:
   ```bash
   # Linux/Mac
   touch .env
   # Windows (PowerShell)
   New-Item .env -ItemType File
   ```
3. Open the `.env` file and paste the following configuration:
   ```properties
   DB_URL=jdbc:mysql://localhost:3306/achieveplus
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:4200
   ```
   > **Important:** The `JWT_SECRET` must be at least 256 bits (32+ characters).

4. Run the Backend:
   ```bash
   # Windows
   .\mvnw spring-boot:run
   
   # Mac/Linux
   ./mvnw spring-boot:run
   ```
   *The backend should start on `http://localhost:8080`.*

---

### 4. Frontend Setup (Angular)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd "Frontend -Achieve+"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start
   ```
   *The frontend application will assume the backend is running at `http://localhost:8080`.*
   *Access the app at `http://localhost:4200`.*

---

## 📂 Project Structure

```
Achieve_PLUS/
├── Backend-Achieve+/       # Spring Boot Backend
│   ├── src/main/java       # Java Source Code
│   ├── src/main/resources  # Configs & Static Resources
│   └── .env                # Environment Variables (Ignored by Git)
├── Frontend -Achieve+/     # Angular Frontend
│   ├── src/app             # Components, Services, Pages
│   └── package.json        # Dependencies
├── README.md               # General Project Info
└── DEV_README.md           # Developer Guide (You are here)
```

## 🐛 Troubleshooting

- **Database Connection Error**: Double-check your MySQL service is running and the credentials in `Backend-Achieve+/.env` match your database user.
- **Port Conflicts**: 
  - Backend defaults to `8080`.
  - Frontend defaults to `4200`.
  - If these ports are busy, close the conflicting process or change the ports in `application.properties` (Backend) or `angular.json` (Frontend).
- **CORS Issues**: Ensure `FRONTEND_URL` in the backend `.env` matches the URL you are using to access the frontend (e.g., `http://localhost:4200`).

Happy Coding! 🚀

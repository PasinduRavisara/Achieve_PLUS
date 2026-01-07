import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

// Import components
import Login from "./auth/Login";
import Signup from "./auth/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import AdminTaskDashboard from "./components/admin/AdminTaskDashboard";
import EmployeeTaskDashboard from "./components/employee/EmployeeTaskDashboard";
import ProgressAnalysis from "./pages/ProgressAnalysis";
import AdminProgressAnalysis from "./pages/AdminProgressAnalysis";
import RewardsAchievements from "./pages/RewardsAchievements";
import RewardStore from "./pages/RewardStore";
import AdminRewardStore from "./pages/AdminRewardStore";
import Profile from "./components/profile/Profile"; 
import Settings from "./components/settings/Settings"; 
import Leaderboard from "./pages/Leaderboard";
import EmployeeWellness from "./pages/EmployeeWellness";
import { useAuth } from "./context/AuthContext";
import AdminEmployeesDetails from "./pages/AdminEmployeesDetails";


function App() {
  const { currentUser, loading, isAdmin } = useAuth();

  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  

  return (
    <div className="app">
      <Routes>
        {/* Home route - redirects based on auth status */}
        <Route
          path="/"
          element={
            currentUser ? (
              isAdmin ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            currentUser ? (
              isAdmin ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={
            currentUser ? (
              isAdmin ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Signup />
            )
          }
        />

        {/* Admin dashboard routes */}
        <Route
          path="/admin-dashboard/*"
          element={
            currentUser && isAdmin ? (
              <AdminDashboard />
            ) : currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Admin Task Dashboard */}
        <Route
          path="/admin-tasks"
          element={
            currentUser && isAdmin ? (
              <AdminTaskDashboard />
            ) : currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Admin Progress Analysis Dashboard */}
        <Route
          path="/admin-progress"
          element={
            currentUser && isAdmin ? (
              <AdminProgressAnalysis />
            ) : currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin Reward Store */}
        <Route
          path="/admin-reward-store"
          element={
            currentUser && isAdmin ? (
              <AdminRewardStore />
            ) : currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

         {/* Admin EmployeesDetails  */}
       <Route
          path="/admin-employees"
          element={
            currentUser && isAdmin ? (
              <AdminEmployeesDetails />
            ) : currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Employee dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            currentUser && !isAdmin ? (
              <EmployeeDashboard />
            ) : currentUser ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Employee Task Dashboard */}
        <Route
          path="/employee-tasks"
          element={
            currentUser && !isAdmin ? (
              <EmployeeTaskDashboard />
            ) : currentUser ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Progress Analysis */}
        <Route
          path="/progress-analysis"
          element={
            currentUser && !isAdmin ? (
              <ProgressAnalysis />
            ) : currentUser ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Rewards */}
        <Route
          path="/employee-rewards"
          element={
            currentUser && !isAdmin ? (
              <RewardsAchievements />
            ) : currentUser ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Reward Store */}
        <Route
          path="/employee-store"
          element={
            currentUser && !isAdmin ? (
              <RewardStore />
            ) : currentUser ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Employee Wellness route */}
        <Route
          path="/employee-wellness"
          element={
            currentUser && !isAdmin ? (
              <EmployeeWellness />
            ) : currentUser ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

    

        {/* Profile route - accessible to both admin and employee */}
        <Route
          path="/profile"
          element={currentUser ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Settings route - accessible to both admin and employee */}
        <Route
          path="/settings"
          element={currentUser ? <Settings /> : <Navigate to="/login" />}
        />

        {/* Leaderboard route - accessible to both admin and employee */}
        <Route
          path="/leaderboard"
          element={currentUser ? <Leaderboard /> : <Navigate to="/login" />}
        />

        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

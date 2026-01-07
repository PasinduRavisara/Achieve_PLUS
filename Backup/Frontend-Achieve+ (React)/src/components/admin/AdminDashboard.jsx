import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  ProgressBar,
  Dropdown,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../layout/Navbar";
import { getAllTasks } from "../../api/tasks";
import { getAllUsers } from "../../api/users";
import AdminReminders from './AdminReminders';
import { BsArrowUp, BsArrowDown, BsSpeedometer2, BsListCheck, BsPeople, 
  BsGraphUp, BsBarChartLine, BsShop, BsGear, BsCheckCircle, 
  BsArrowRepeat, BsPlusCircle, BsInfoCircle, BsClock, BsSun, BsMoon, BsStars, BsTrophy, BsBrightnessAltHigh, BsFillSunFill, BsFillPeopleFill } from "react-icons/bs";
import "../../styles/AdminStyles.css";

const AdminDashboard = ({ onLogout }) => {
  const { currentUser } = useAuth();
  const [, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });
  const [, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  const adminSidebarItems = [
    { title: "Dashboard", path: "/admin-dashboard", icon: "bi-speedometer2" },
    { title: "Tasks", path: "/admin-tasks", icon: "bi-list-check" },
    { title: "Progress Analysis", path: "/admin-progress", icon: "bi-graph-up" },
    { title: "Leaderboard", path: "/leaderboard", icon: "bi-bar-chart-line" },
    { title: "Reward Store", path: "/admin-reward-store", icon: "bi-shop" },
    { title: "Employees", path: "/admin-employees", icon: "bi-people" },
    
  ];
  
    
  // Feature cards for the dashboard
  const featureCards = [
    {
      title: "Task Management",
      description: "Create, assign, and track tasks for your team members",
      icon: <BsListCheck size={24} />,
      color: "primary",
      path: "/admin-tasks",
    },
    {
      title: "Employee Management",
      description: "Manage employee profiles, roles, and permissions",
      icon: <BsPeople size={24} />,
      color: "success",
      path: "/admin-employees",
    },
    {
      title: "Progress Analysis",
      description: "View detailed analytics and reports on team performance",
      icon: <BsGraphUp size={24} />,
      color: "info",
      path: "/admin-progress",
    },
    {
      title: "Leaderboard",
      description: "View top performers and encourage healthy competition",
      icon: <BsBarChartLine size={24} />,
      color: "warning",
      path: "/leaderboard",
    },
  ];

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all tasks
        const tasksData = await getAllTasks();
        setTasks(tasksData);

        // Fetch all users
        const usersData = await getAllUsers();
        setUsers(usersData);

        // Calculate task statistics
        const totalTasks = tasksData.length;
        const completedTasks = tasksData.filter(
          (task) => task.status === "COMPLETED" || task.status === "Completed"
        ).length;
        const pendingTasks = tasksData.filter(
          (task) => task.status === "PENDING" || task.status === "New"
        ).length;
        const inProgressTasks = tasksData.filter(
          (task) =>
            task.status === "IN_PROGRESS" || task.status === "In Progress"
        ).length;

        setTaskStats({
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Calculate completion rate and change from previous
  const getCompletionRate = () => {
    if (taskStats.totalTasks === 0) return { value: "0%", change: "0%" };

    const completionRate = Math.round(
      (taskStats.completedTasks / taskStats.totalTasks) * 100
    );
  //for demo random number
    const change = `+${Math.floor(Math.random() * 10)}%`;

    return { value: `${completionRate}%`, change };
  };

  // Company overview stats
  const companyOverview = [
    {
      title: "Total Tasks",
      value: taskStats.totalTasks,
      change: `+${taskStats.totalTasks}`,
      icon: <BsListCheck size={24} />,
      color: "info",
    },
    {
      title: "Team Members",
      value: users.filter(
        (user) => user.role === "ROLE_EMPLOYEE" || user.role === "Employee"
      ).length,
      change: "+0",
      icon: <BsPeople size={24} />,
      color: "success",
    },
    {
      title: "In Progress",
      value: taskStats.inProgressTasks,
      change: `+${taskStats.inProgressTasks}`,
      icon: <BsArrowRepeat size={24} />,
      color: "primary",
    },
    {
      title: "Completion Rate",
      value: getCompletionRate().value,
      change: getCompletionRate().change,
      icon: <BsCheckCircle size={24} />,
      color: "warning",
    },
  ];

  // Custom loading spinner component
  const LoadingSpinner = () => (
    <div className="text-center p-5">
      <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-primary">Loading dashboard data...</p>
    </div>
  );

  // Empty state component
  const EmptyState = ({ icon, message }) => (
    <div className="text-center p-5">
      {icon}
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );

  // Custom avatar component
  const Avatar = ({ name, color }) => {
    const bgColors = {
      A: "primary", B: "success", C: "danger", D: "warning", 
      E: "info", F: "secondary", G: "primary", H: "success",
      I: "danger", J: "warning", K: "info", L: "secondary",
      M: "primary", N: "success", O: "danger", P: "warning",
      Q: "info", R: "secondary", S: "primary", T: "success",
      U: "danger", V: "warning", W: "info", X: "secondary",
      Y: "primary", Z: "success"
    };
    
    const letter = name.charAt(0).toUpperCase();
    const bgColor = color || bgColors[letter] || "primary";
    
    return (
      <div className={`avatar-circle bg-${bgColor} text-white d-flex align-items-center justify-content-center`} 
           style={{ width: "40px", height: "40px", borderRadius: "50%", fontSize: "18px", fontWeight: "bold" }}>
        {letter}
      </div>
    );
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <div className="admin-dashboard-bg min-vh-100">
        <Navbar userType="admin" onLogout={onLogout} />
        
        {/* Enhanced Header with gradient background and greeting */}
        <div className="mb-4 p-4 bg-gradient-primary-to-secondary text-white rounded-lg shadow-lg position-relative overflow-hidden">
          <div className="position-absolute top-0 end-0 opacity-10 pe-4 me-4 mt-4">
            {greeting === "Good Morning" && <BsFillPeopleFill  size={95} />}
            {greeting === "Good Afternoon" && <BsFillPeopleFill  size={95} />}
            {greeting === "Good Evening" && <BsFillPeopleFill  size={95}/>}
          </div>
          <div className="position-relative">
            <h3 className="mb-2 display-6 fw-bold">
              {greeting}, {currentUser?.fullName || "Admin"}
            </h3>
            <h5 className="fw-semibold opacity-90">
              Manage your team and boost productivity with AchievePlus
            </h5>
          </div>
        </div>

        {/* Enhanced Stats with animations */}
        <Row className="mb-4 g-3">
          {companyOverview.map((stat, index) => (
            <Col md={6} lg={3} key={index}>
              <Card className="h-100 border-0 shadow-sm hover-lift" 
                    style={{ 
                      transition: "all 0.3s ease",
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
                    }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small text-uppercase fw-bold">{stat.title}</p>
                      <h3 className="mb-0 fw-bold">{stat.value}</h3>
                      <span
                        className={`badge bg-${stat.color}-subtle text-${stat.color} mt-2 px-2 py-1`}
                      >
                        {stat.change}{" "}
                        {stat.change.startsWith("+") ? <BsArrowUp /> : <BsArrowDown />}
                      </span>
                    </div>
                    <div className={`bg-${stat.color}-subtle p-3 rounded-circle`}>
                      {stat.icon}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Enhanced Feature Route Cards with hover effects */}
        <Row className="mb-4 g-3">
          {featureCards.map((feature, index) => (
            <Col md={6} lg={3} key={index}>
              <Link to={feature.path} className="text-decoration-none">
                <Card className="h-100 shadow-sm hover-card border-0" 
                      style={{ 
                        transition: "all 0.3s ease",
                        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                        overflow: "hidden"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
                      }}>
                  <div className={`bg-${feature.color} p-2 position-absolute top-0 start-0 end-0`} style={{ height: "8px" }}></div>
                  <Card.Body className="d-flex flex-column align-items-center text-center p-4 pt-5">
                    <div
                      className={`rounded-circle bg-${feature.color}-subtle p-3 mb-3 d-flex align-items-center justify-content-center`}
                      style={{ width: "70px", height: "70px" }}
                    >
                      <span className={`text-${feature.color}`}>{feature.icon}</span>
                    </div>
                    <h5 className="card-title fw-bold">{feature.title}</h5>
                    <p className="card-text text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>


        {/* Task Stats with progress bars */}
        <Row className="mb-4 g-3">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Task Status Overview</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h6 className="mb-2 text-muted">Total Progress</h6>
                    <div className="d-flex align-items-baseline">
                      <span className="display-6 fw-bold me-2">{taskStats.completedTasks}</span>
                      <span className="text-muted">
                        / {taskStats.totalTasks} tasks completed
                      </span>
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="primary" 
                      as={Link} 
                      to="/admin-tasks"
                      className="rounded-pill px-4 py-2 d-flex align-items-center"
                    >
                      <BsListCheck className="me-2" /> View All Tasks
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <Badge bg="primary-subtle" text="primary" className="px-3 py-2 rounded-pill">
                        <BsArrowRepeat className="me-1" /> In Progress: {taskStats.inProgressTasks}
                      </Badge>
                    </div>
                    <div className="fw-semibold">
                      {Math.round(
                        (taskStats.inProgressTasks / taskStats.totalTasks) * 100
                      ) || 0}%
                    </div>
                  </div>
                  <ProgressBar
                    variant="primary"
                    now={(taskStats.inProgressTasks / taskStats.totalTasks) * 100 || 0}
                    style={{ height: "10px", borderRadius: "10px" }}
                    animated
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <Badge bg="success-subtle" text="success" className="px-3 py-2 rounded-pill">
                        <BsCheckCircle className="me-1" /> Completed: {taskStats.completedTasks}
                      </Badge>
                    </div>
                    <div className="fw-semibold">
                      {Math.round(
                        (taskStats.completedTasks / taskStats.totalTasks) * 100
                      ) || 0}%
                    </div>
                  </div>
                  <ProgressBar
                    variant="success"
                    now={(taskStats.completedTasks / taskStats.totalTasks) * 100 || 0}
                    style={{ height: "10px", borderRadius: "10px" }}
                  />
                </div>

                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <Badge bg="warning-subtle" text="warning" className="px-3 py-2 rounded-pill">
                        <BsClock className="me-1" /> Pending: {taskStats.pendingTasks}
                      </Badge>
                    </div>
                    <div className="fw-semibold">
                      {Math.round(
                        (taskStats.pendingTasks / taskStats.totalTasks) * 100
                      ) || 0}%
                    </div>
                  </div>
                  <ProgressBar
                    variant="warning"
                    now={(taskStats.pendingTasks / taskStats.totalTasks) * 100 || 0}
                    style={{ height: "10px", borderRadius: "10px" }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Reminders section */}
          <Col lg={4}>
            <AdminReminders />
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
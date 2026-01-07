import React, { useState, useEffect } from "react";
import { Container, Card, Alert, Spinner } from "react-bootstrap";
import { getLeaderboardUsers } from "../api/users";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from '../components/layout/DashboardLayout';
import "../styles/Leaderboard.css";

// Array of default avatars to use if user doesn't have a photo
const DEFAULT_AVATARS = [
  "/assets/avatars/avatar-1.png",
  "/assets/avatars/avatar-2.png",
  "/assets/avatars/avatar-3.png",
  "/assets/avatars/avatar-4.png",
  "/assets/avatars/avatar-5.png",
];

const Leaderboard = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  
  const sidebarItems = isAdmin
    ? [
        {
          title: "Dashboard",
          path: "/admin-dashboard",
          icon: "bi-speedometer2",
        },
        { title: "Tasks", path: "/admin-tasks", icon: "bi-list-check" },
        {
          title: "Progress Analysis",
          path: "/admin-progress",
          icon: "bi-graph-up",
        },
        {
          title: "Leaderboard",
          path: "/leaderboard",
          icon: "bi-bar-chart-line",
        },
        { title: "Reward Store", path: "/admin-reward-store", icon: "bi-shop" },
        { title: "Employees", path: "/admin-employees", icon: "bi-people" },
        
      ]
    : [
      { title: 'Dashboard', path: '/employee-dashboard', icon: 'bi-speedometer2' },
      { title: 'My Tasks', path: '/employee-tasks', icon: 'bi-list-check' },
      { title: 'Progress Analysis', path: '/progress-analysis', icon: 'bi-graph-up' },
      { title: 'Rewards & Achievements', path: '/employee-rewards', icon: 'bi-trophy' },
      { title: 'Leaderboard', path: '/leaderboard', icon: 'bi-bar-chart-line' },
      { title: 'Reward Store', path: '/employee-store', icon: 'bi-shop' },
      { title: 'Wellness Hub', path: '/employee-wellness', icon: 'bi-heart-pulse' },
      
    ];

  // Handle image loading errors
  const handleImageError = (userId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [userId]: true
    }));
  };

  // Get fallback avatar based on user ID
  const getFallbackAvatar = (userId) => {
    const index = parseInt(userId, 10) % DEFAULT_AVATARS.length;
    return DEFAULT_AVATARS[index];
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const leaderboardUsers = await getLeaderboardUsers();

        // Map users and take top 6
        const topUsers = leaderboardUsers
          .map((user) => ({
            id: user.id,
            displayName: user.fullName,
            points: user.points || 0,
            photoURL: user.photoURL || null,
            department: user.department || "Team Member",
            tasksCompleted: user.tasksCompleted || 0,
          }))
          .slice(0, 6); // Get top 6 users

        setUsers(topUsers);
        setError("");
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getTopThree = () => users.slice(0, 3);
  const getRemainingUsers = () => users.slice(3);

  // Render user avatar with fallback handling
  const renderUserAvatar = (user) => {
    const userImageSrc = imageLoadErrors[user.id] ? getFallbackAvatar(user.id) : (user.photoURL || getFallbackAvatar(user.id));
    
    return (
      <img 
        src={userImageSrc} 
        alt={user.displayName} 
        onError={() => handleImageError(user.id)}
        className="avatar-image"
      />
    );
  };

  // Render top three users
  const renderTopThree = () => {
    const topThree = getTopThree();
    // Array to determine display order
    const displayOrder = [
      { position: 1, className: "position-1", order: 2 }, // middle
      { position: 2, className: "position-2", order: 3 }, // right
      { position: 3, className: "position-3", order: 1 }  // left
    ];

    return displayOrder.map((config, index) => {
      if (index >= topThree.length) return null;
      
      const user = topThree[index];
      
      return (
        <Card
          key={user.id}
          className={`top-three-card ${config.className}`}
          style={{ order: config.order }}
        >
          <div className="position-badge">{config.position}</div>
          <div className="user-avatar">
            {renderUserAvatar(user)}
            {config.position === 1 && <div className="crown">👑</div>}
          </div>
          <div className="user-name">{user.displayName}</div>
          <div className="user-department">{user.department}</div>
          <div className="user-points">{user.points} Points</div>
         </Card>
      );
    });
  };

  // Render remaining users with position cards
  const renderRemainingUsers = () => {
    const remainingUsers = getRemainingUsers();
    
    if (remainingUsers.length === 0) return null;
    
    return (
      <div className="position-cards-container">
        {remainingUsers.map((user, index) => (
          <div key={user.id} className="position-card">
            <div className="position-badge">{index + 4}</div>
            <div className="user-row">
              <div className="small-avatar-container">
                {renderUserAvatar(user)}
              </div>
              <div className="user-info">
                <span className="user-name">{user.displayName}</span>
                <span className="user-department">{user.department}</span>
              </div>
              <div className="user-stats">
                <span className="user-points">{user.points} Points</span>
                <span className="user-tasks">{user.tasksCompleted} Tasks</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render leaderboard content
  const renderLeaderboardContent = () => {
    if (loading) {
      return (
        <Container className="leaderboard-container d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      );
    }

    if (error) {
      return (
        <Container className="leaderboard-container">
          <Alert variant="danger">{error}</Alert>
        </Container>
      );
    }

    return (
      <div style={{ backgroundColor: '#e6f2ff', padding: '1.5rem' }} className="min-vh-100">
        <Container className="leaderboard-container">
          <h1 className="leaderboard-title">LEADERBOARD</h1>
          
          <div className="leaderboard-content-wrapper">
            <div className="top-three-section">
              <div className="top-three-container">
                {renderTopThree()}
              </div>
            </div>
            
            <div className="remaining-users-section">
              {renderRemainingUsers()}
            </div>
          </div>
        </Container>
      </div>
    );
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      {renderLeaderboardContent()}
    </DashboardLayout>
  );
};

export default Leaderboard;
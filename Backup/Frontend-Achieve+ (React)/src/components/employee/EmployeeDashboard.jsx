import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Spinner, Alert, ProgressBar, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import { getCurrentUserTasks, getCurrentUserStats } from '../../api/tasks';
import { getCurrentUserAchievements, getUserAchievementStats } from '../../api/achievements';
import TaskList from '../tasks/TaskList';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../../styles/EmployeeDashboard.css';
import personImage from '../../assets/person3.png';


const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickStats, setQuickStats] = useState({
    points: 0,
    completedTasks: 0,
    totalBadges: 0, 
    rank: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalBadges: 0,
    tasksCompleted: 0,
    totalPoints: 0,
    currentStreak: 0
  });

  const employeeSidebarItems = [
    { title: 'Dashboard', path: '/employee-dashboard', icon: 'bi-speedometer2' },
    { title: 'My Tasks', path: '/employee-tasks', icon: 'bi-list-check' },
    { title: 'Progress Analysis', path: '/progress-analysis', icon: 'bi-graph-up' },
    { title: 'Rewards & Achievements', path: '/employee-rewards', icon: 'bi-trophy' },
    { title: 'Leaderboard', path: '/leaderboard', icon: 'bi-bar-chart-line' },
    { title: 'Reward Store', path: '/employee-store', icon: 'bi-shop' },
    { title: 'Wellness Hub', path: '/employee-wellness', icon: 'bi-heart-pulse' },
    
  ];

    // Fetch achievements data
  const fetchAchievements = async () => {
    try {
      // Get user ID from context or localStorage
      const userId = currentUser?.id || JSON.parse(localStorage.getItem('user'))?.id;
      console.log('Using user ID:', userId);

      if (!userId) {
        throw new Error('No user ID available');
      }

      const [achievementsData, statsData] = await Promise.all([
        getCurrentUserAchievements(userId),
        getUserAchievementStats(userId)
      ]);
      
      console.log('Achievements data:', achievementsData);
      console.log('Stats data:', statsData);
      
      setAchievements(achievementsData || []);
      setStats({
        totalBadges: statsData.totalBadges || 0,
        tasksCompleted: statsData.tasksCompleted || 0,
        totalPoints: statsData.totalPoints || 0,
        currentStreak: statsData.currentStreak || 0
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load achievements. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks
        const tasksData = await getCurrentUserTasks();
        setTasks(tasksData);
        
        // Fetch user stats
        const statsData = await getCurrentUserStats();
        
        // Fetch achievements data
        await fetchAchievements();
        
        // Update quick stats
        setQuickStats({
          points: statsData.totalPoints || 0,
          completedTasks: tasksData.filter(task => 
            task.status === 'COMPLETED' || task.status === 'Completed'
          ).length,
          totalBadges: stats.totalBadges || 0, 
          rank: statsData.rank || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update quickStats when stats changes
  useEffect(() => {
    setQuickStats(prev => ({
      ...prev,
      totalBadges: stats.totalBadges || 0
    }));
  }, [stats]);

  // Filter upcoming deadlines from tasks
  const getUpcomingDeadlines = () => {
    const today = new Date();
    const upcomingTasks = tasks
      .filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate > today && 
          (task.status === 'PENDING' || 
           task.status === 'New' || 
           task.status === 'IN_PROGRESS' || 
           task.status === 'In Progress');
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3)
      .map(task => ({
        id: task.id,
        title: task.title,
        dueDate: formatDate(new Date(task.dueDate)),
        priority: task.priority ? task.priority.toLowerCase() : 'medium'
      }));
      
    return upcomingTasks;
  };

  // Get recently completed tasks
  const getRecentlyCompletedTasks = () => {
    return tasks
      .filter(task => 
        task.status === 'COMPLETED' || task.status === 'Completed'
      )
      .sort((a, b) => new Date(b.completedDate || b.updatedAt) - new Date(a.completedDate || a.updatedAt))
      .slice(0, 5);
  };

  // Format date to string like "Mar 20, 2025"
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "danger",
      medium: "warning",
      low: "success"
    };
    return <Badge bg={colors[priority]} className="text-uppercase fs-8">{priority}</Badge>;
  };

  // Add new component for Activity Timeline
  const ActivityTimeline = ({ activities }) => (
    <div className="activity-timeline">
      {activities.map((activity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="d-flex activity-item mb-3"
        >
          <div className="activity-icon me-3">
            <div className={`icon-wrapper bg-${activity.type}-subtle p-2 rounded-circle`}>
              <i className={`bi ${activity.icon} text-${activity.type}`}></i>
            </div>
          </div>
          <div className="activity-content">
            <p className="fw-medium mb-1">{activity.title}</p>
            <small className="text-muted">{activity.time}</small>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Add new component for Performance Card
  const PerformanceCard = ({ title, value, total, icon, color }) => (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{`${value} out of ${total}`}</Tooltip>}
    >
      <Card className="border-0 h-100 shadow-sm performance-card">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <div className={`icon-wrapper bg-${color}-subtle p-2 rounded-circle me-2`}>
              <i className={`bi ${icon} text-${color}`}></i>
            </div>
            <h6 className="mb-0">{title}</h6>
          </div>
          <div style={{ width: 80, height: 80 }} className="mb-3 mx-auto">
            <CircularProgressbar
              value={(value / total) * 100}
              text={`${value}`}
              styles={buildStyles({
                pathColor: `var(--bs-${color})`,
                textColor: `var(--bs-${color})`,
                trailColor: `var(--bs-${color}-subtle)`
              })}
            />
          </div>
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );

  // Replace the getRecentActivities function with this fixed version
  const getRecentActivities = () => {
    const activities = [];

    // Add completed tasks
    const completedTasks = tasks
      .filter(task => task.status === 'COMPLETED' || task.status === 'Completed')
      .sort((a, b) => {
        // Handle cases where dates might be missing
        const dateA = task => new Date(task.completedDate || task.updatedAt || Date.now());
        const dateB = task => new Date(task.completedDate || task.updatedAt || Date.now());
        return dateB(b) - dateA(a);
      })
      .slice(0, 3)
      .map(task => ({
        title: `Completed task "${task.title || 'Untitled Task'}"`,
        time: 'Recently',
        type: 'success',
        icon: 'bi-check-circle-fill'
      }));

    // Add achievements with fallback for name and date
    const recentAchievements = achievements
      .filter(achievement => achievement && achievement.name) // Ensure achievement exists and has a name
      .map(achievement => ({
        title: `Earned "${achievement.name || 'Badge'}" badge`,
        time: 'Recently',
        type: 'warning',
        icon: 'bi-award-fill'
      }))
      .slice(0, 2);

    // Add in-progress tasks
    const inProgressTasks = tasks
      .filter(task => task.status === 'IN_PROGRESS' || task.status === 'In Progress')
      .sort((a, b) => {
        // Handle cases where dates might be missing
        const dateA = task => new Date(task.updatedAt || Date.now());
        const dateB = task => new Date(task.updatedAt || Date.now());
        return dateB(b) - dateA(a);
      })
      .slice(0, 2)
      .map(task => ({
        title: `Started task "${task.title || 'Untitled Task'}"`,
        time: 'Recently',
        type: 'info',
        icon: 'bi-play-circle-fill'
      }));

    // Combine all activities
    activities.push(...completedTasks, ...recentAchievements, ...inProgressTasks);
    
    // Sort and return activities 
    return activities.slice(0, 5);
  };
  

  // Replace the formatTimeAgo function with a safer version
  const formatTimeAgo = (dateInput) => {
    try {
      // If date is invalid or undefined, return a default string
      if (!dateInput || isNaN(new Date(dateInput).getTime())) {
        return 'Recently';
      }
      
      const date = new Date(dateInput);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) {
        return 'Just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else {
        return formatDate(date);
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <DashboardLayout sidebarItems={employeeSidebarItems}>
        <div className="d-flex align-items-center justify-content-center employee-dashboard-bg" style={{ height: '80vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={employeeSidebarItems}>
      <div className="employee-dashboard-bg min-vh-100">
        <Navbar />
        
        {error && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            </motion.div>
          </AnimatePresence>
        )}
        
       <Card className="border-0 shadow-sm overflow-hidden bg-gradient mb-4" style={{ maxWidth: '1650px', margin: '0 auto' }}>
  <Card.Body className="p-0">
    <Row className="g-0">
      <Col md={8} className="p-5 welcome-content">
        <div className="welcome-text">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-muted">
              <i className="bi bi-calendar3 me-2"></i>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h5>
            <h5 className="mb-0 text-muted">
              <i className="bi bi-clock me-2"></i>
              <span id="current-time">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </h5>
          </div>
         
          <h3 className="fw-bold text-primary mb-1">Welcome To Achieve+,</h3>
          <h3 className="fw-bold text-dark mb-3">
            <span className="highlight-name">{currentUser?.fullName || 'Employee'}</span>
            <span className="name-underline"></span>
          </h3>
          <p className="text-muted mb-4">
            Your personal dashboard to track progress and achievements 
          </p>
         </div>
      </Col>
      <Col md={4} className="text-end p-0 d-flex align-items-center justify-content-center banner-image-container">
        <div className="banner-image-wrapper"   >
          <img
            src={personImage}
            alt="Person working on laptop"
            className="img-fluid banner-image"
            style={{ maxHeight: '450px' }} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        </div>
      </Col>
    </Row>
  </Card.Body>
</Card>

<style jsx>{`
  .bg-gradient {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  }
  
  .welcome-content {
    position: relative;
    z-index: 1;
    padding:50px;
  }
  
  .welcome-text h3.text-primary {
    color: #4361ee !important;
  }
  
  .banner-image-container {
    background: linear-gradient(135deg, #a6b1e4 0%, #3b7bea 100%);
    overflow: hidden;
    position: relative;
  }
  
  .banner-image-wrapper {
    height: 100%;
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0rem;
  }
  
  .banner-image {
    max-height: 250px;
    object-fit: contain;
    filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04));
    transition: all 0.3s ease;
  }
  
  .btn-primary {
    background-color: #4361ee;
    border-color: #4361ee;
    box-shadow: 0 4px 6px rgba(67, 97, 238, 0.2);
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    background-color: #3a0ca3;
    border-color: #3a0ca3;
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(67, 97, 238, 0.3);
  }
  
  @media (max-width: 767.98px) {
    .banner-image-container {
      min-height: 200px;
    }
  }

  .welcome-card {
    border-radius: 15px; 
    padding: 20px; 
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  }

  .performance-overview {
    max-width: 900px; 
    margin: 0 auto; 
  }
`}</style>

{/* Add this script to keep the time updated */}
<script dangerouslySetInnerHTML={{
  __html: `
    function updateTime() {
      const timeElement = document.getElementById('current-time');
      if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
      setTimeout(updateTime, 60000); // Update every minute
    }
    updateTime();
  `
}} />

          {/* Quick stats row */}
          <Row className="gx-3 mt-4 mb-4">
            <Col xs={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 p-2 rounded-3 me-3">
                      <i className="text-info bi bi-check-circle fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-0">Tasks Completed</h6>
                      <h4 className="mb-0">{quickStats.completedTasks}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-opacity-10 bg-warning p-2 rounded-3 me-3">
                      <i className="text-warning bi bi-award fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-0">Badges Earned</h6>
                      <h4 className="mb-0">{quickStats.totalBadges}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-opacity-10 bg-success p-2 rounded-3 me-3">
                      <i className="text-success bi bi-trophy fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-0">Current Rank</h6>
                      <h4 className="mb-0">#{quickStats.rank}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

                
        {/* Upcoming Deadlines and Completed Tasks Section */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card className="border-0 h-100 rounded-4 shadow-sm overflow-hidden">
              <Card.Header className="d-flex align-items-center bg-white border-bottom-0 pb-2 pt-3 px-4">
                <div className="bg-opacity-10 bg-primary p-2 rounded-circle me-2">
                  <i className="text-primary bi bi-calendar-event"></i>
                </div>
                <h5 className="fw-semibold mb-0 ms-2">Upcoming Deadlines</h5>
              </Card.Header>
              <Card.Body className="pb-4 pt-2 px-4">
                {getUpcomingDeadlines().length === 0 ? (
                  <div className="text-center my-3 py-4">
                    <div className="d-inline-flex bg-light p-3 rounded-circle mb-2">
                      <i className="text-primary bi bi-calendar-check fs-1"></i>
                    </div>
                    <p className="text-muted mb-0">No upcoming deadlines!</p>
                  </div>
                ) : (
                  getUpcomingDeadlines().map((task, index) => (
                    <div 
                      key={task.id} 
                      className={`d-flex align-items-center py-3 px-3 rounded-3 transition-all hover-bg-light ${
                        index !== getUpcomingDeadlines().length - 1 ? 'border-bottom border-light' : ''
                      }`}
                    >
                      <div className="text-primary me-3">
                        <i className="bi bi-clock"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="text-truncate mb-0">{task.title}</h6>
                          {task.priority === 'high' && (
                            <Badge bg="danger" pill className="px-2 py-1">high</Badge>
                          )}
                        </div>
                        <div>
                          <span className="text-primary fw-medium small">Due {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="border-0 h-100 rounded-4 shadow-sm overflow-hidden">
              <Card.Header className="d-flex align-items-center bg-white border-bottom-0 pb-2 pt-3 px-4">
                <div className="bg-opacity-10 bg-success p-2 rounded-circle me-2">
                  <i className="text-success bi bi-check-circle-fill"></i>
                </div>
                <h5 className="fw-semibold mb-0 ms-2">Recently Completed Tasks</h5>
              </Card.Header>
              <Card.Body className="pb-4 pt-2 px-4">
                {getRecentlyCompletedTasks().length === 0 ? (
                  <div className="text-center my-3 py-4">
                    <div className="d-inline-flex bg-light p-3 rounded-circle mb-2">
                      <i className="text-success bi bi-check-circle fs-1"></i>
                    </div>
                    <p className="text-muted mb-0">No completed tasks yet!</p>
                  </div>
                ) : (
                  getRecentlyCompletedTasks().map((task, index) => (
                    <div 
                      key={task.id} 
                      className={`d-flex align-items-center py-3 px-3 rounded-3 transition-all hover-bg-light ${
                        index !== getRecentlyCompletedTasks().length - 1 ? 'border-bottom border-light' : ''
                      }`}
                    >
                      <div className="text-success me-3">
                        <i className="bi bi-check-circle"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="text-truncate fs-6 mb-0">{task.title}</h6>
                          <span className="text-muted small">Completed</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* New Performance Overview Section */}
        <Row className="g-4 mb-4">
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <Card.Header className="bg-white border-0 pt-4">
                <h5 className="mb-0">Performance Overview</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-4">
                  <Col sm={4}>
                    <PerformanceCard
                      title="Weekly Tasks"
                      value={quickStats.completedTasks}
                      total={20}
                      icon="bi-list-check"
                      color="primary"
                    />
                  </Col>
                  <Col sm={4}>
                    <PerformanceCard
                      title="Achievement Rate"
                      value={stats.totalBadges}
                      total={20}
                      icon="bi-trophy"
                      color="warning"
                    />
                  </Col>
                  <Col sm={4}>
                    <PerformanceCard
                      title="Points Goal"
                      value={stats.totalPoints % 1000}
                      total={100}
                      icon="bi-star"
                      color="success"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          </Row>

      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
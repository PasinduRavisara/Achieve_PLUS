import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaTrophy, FaMedal, FaStar, FaAward } from 'react-icons/fa';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getCurrentUserAchievements, getUserAchievementStats } from '../api/achievements';
import { useAuth } from '../context/AuthContext';
import '../styles/RewardsAchievements.css';
import Navbar from '../components/layout/Navbar';

const RewardsAchievements = () => {
  const { currentUser } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalBadges: 0,
    tasksCompleted: 0,
    totalPoints: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug logging
  console.log('Current user from auth context:', currentUser);
  console.log('Stored user data:', localStorage.getItem('user'));
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Parsed stored user:', storedUser);
  } catch (e) {
    console.error('Error parsing stored user:', e);
  }

  const employeeSidebarItems = [
    { title: 'Dashboard', path: '/employee-dashboard', icon: 'bi-speedometer2' },
    { title: 'My Tasks', path: '/employee-tasks', icon: 'bi-list-check' },
    { title: 'Progress Analysis', path: '/progress-analysis', icon: 'bi-graph-up' },
    { title: 'Rewards & Achievements', path: '/employee-rewards', icon: 'bi-trophy' },
    { title: 'Leaderboard', path: '/leaderboard', icon: 'bi-bar-chart-line' },
    { title: 'Reward Store', path: '/employee-store', icon: 'bi-shop' },
    { title: 'Wellness Hub', path: '/employee-wellness', icon: 'bi-heart-pulse' },
    // { title: 'Profile Settings', path: '/employee-profile', icon: 'bi-person-gear' },
    // { title: 'Help & Support', path: '/employee-help', icon: 'bi-question-circle' }
  ];

  useEffect(() => {
    console.log('useEffect triggered, currentUser:', currentUser);
    if (!currentUser) {
      console.log('No current user, checking localStorage...');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Found stored user:', parsedUser);
          if (!parsedUser.id) {
            setError('User ID not found. Please log in again.');
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing stored user:', e);
          setError('Invalid user data. Please log in again.');
          setLoading(false);
          return;
        }
      } else {
        console.log('No stored user found');
        setError('Please log in to view achievements');
        setLoading(false);
        return;
      }
    }
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'speed_star':
        return <FaTrophy className="badge-icon gold" />;
      case 'efficiency_master':
        return <FaMedal className="badge-icon silver" />;
      default:
        return <FaAward className="badge-icon" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout sidebarItems={employeeSidebarItems}>
        <div className="d-flex align-items-center justify-content-center min-vh-100 rewards-bg">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={employeeSidebarItems}>
      <div className="min-vh-100 rewards-bg">
        <Navbar />
        <Container fluid>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h1 className="h3 mb-0">Rewards & Achievements</h1>
              <p className="text-muted">Track your earned badges and accomplishments</p>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Stats Overview */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="achievement-stat-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="gold stat-icon">
                      <FaTrophy />
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0">Total Badges</h6>
                      <h3 className="mb-0">{stats.totalBadges}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="achievement-stat-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="bronze stat-icon">
                      <FaStar />
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0">Points Earned</h6>
                      <h3 className="mb-0">{stats.totalPoints}</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="achievement-stat-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="primary stat-icon">
                      <FaAward />
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0">Current Streak</h6>
                      <h3 className="mb-0">{stats.currentStreak} days</h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Achievements Grid */}
          <h4 className="mb-4">Your Achievements</h4>
          <Row>
            {achievements.length === 0 ? (
              <Col>
                <Card className="p-5 text-center">
                  <Card.Body>
                    <FaTrophy className="mb-3" style={{ fontSize: '3rem', color: '#ddd' }} />
                    <h5>No Achievements Yet</h5>
                    <p className="text-muted">Complete tasks before their due date to earn badges!</p>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              achievements.map((achievement) => (
                <Col key={achievement.id} md={4} lg={3} className="mb-4">
                  <Card className="h-100 achievement-card">
                    <Card.Body className="text-center">
                      <div className="badge-container mb-3">
                        {getBadgeIcon(achievement.badge)}
                      </div>
                      <h5>{achievement.taskTitle}</h5>
                      <p className="text-muted mb-3">{achievement.description}</p>
                      <Badge 
                        bg={achievement.badge === 'SPEED_STAR' ? 'warning' : 'info'}
                        className="achievement-badge"
                      >
                        {achievement.badge.replace('_', ' ')}
                      </Badge>
                      <div className="achievement-date mt-2">
                        Earned on: {achievement.earnedAt}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default RewardsAchievements; 
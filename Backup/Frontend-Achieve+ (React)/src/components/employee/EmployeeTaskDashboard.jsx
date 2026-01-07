import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import Navbar from '../layout/Navbar';
import TaskList from '../tasks/TaskList';
import { getCurrentUserTasks } from '../../api/tasks';
import DashboardLayout from '../layout/DashboardLayout';
import '../../styles/EmployeeTaskDashboard.css';

const EmployeeTaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const employeeSidebarItems = [
    { title: 'Dashboard', path: '/employee-dashboard', icon: 'bi-speedometer2' },
    { title: 'My Tasks', path: '/employee-tasks', icon: 'bi-list-check' },
    { title: 'Progress Analysis', path: '/progress-analysis', icon: 'bi-graph-up' },
    { title: 'Rewards & Achievements', path: '/employee-rewards', icon: 'bi-trophy' },
    { title: 'Leaderboard', path: '/leaderboard', icon: 'bi-bar-chart-line' },
    { title: 'Reward Store', path: '/employee-store', icon: 'bi-shop' },
    { title: 'Wellness Hub', path: '/employee-wellness', icon: 'bi-heart-pulse' },
    
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUserTasks();
      setTasks(response);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center employee-task-bg min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <DashboardLayout sidebarItems={employeeSidebarItems}>
      {/* <div className="employee-task-bg min-vh-100"> */}
      <div style={{ backgroundColor: '#e6f2ff', padding: '1.5rem' }} className="min-vh-100">
        <Navbar />
        <Container fluid>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h1 className="h3 mb-0" style={{ paddingLeft: "30px" }}>My Tasks</h1>
              <p className="text-muted" style={{ paddingLeft: "30px" }}>Manage and track your assigned tasks</p>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Card className="border-0 shadow-sm"
          style={{ 
            borderRadius: '15px',
            background: 'white',
            marginLeft: '30px',
          }}>
            <Card.Body>
              <TaskList 
                externalTasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                refreshTasks={fetchTasks}
                isEmployeeView={true}
              />
            </Card.Body>
          </Card>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeTaskDashboard;
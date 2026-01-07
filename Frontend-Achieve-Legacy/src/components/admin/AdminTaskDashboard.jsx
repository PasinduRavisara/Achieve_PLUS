import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import Navbar from '../layout/Navbar';
import TaskList from '../tasks/TaskList';
import DashboardLayout from '../layout/DashboardLayout';
import { getCurrentUserTasks } from '../../api/tasks';
import { BsSearch, BsHourglassSplit, BsArrowRepeat, BsCheckCircle } from 'react-icons/bs';
import "../../styles/AdminStyles.css";

const AdminTaskDashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  useEffect(() => {
    filterTasks();
  }, [searchTerm, tasks]);

    const adminSidebarItems = [
    { title: 'Dashboard', path: '/admin-dashboard', icon: 'bi-speedometer2' },
    { title: 'Tasks', path: '/admin-tasks', icon: 'bi-list-check' },
    { title: 'Progress Analysis', path: '/admin-progress', icon: 'bi-graph-up' },
    { title: 'Leaderboard', path: '/leaderboard', icon: 'bi-bar-chart-line' },
    { title: "Reward Store", path: "/admin-reward-store", icon: "bi-shop" },
    { title: 'Employees', path: '/admin-employees', icon: 'bi-people' },
    
  ];

  const fetchTasks = async () => {
    try {
      const response = await getCurrentUserTasks();
      setTasks(response);
      setFilteredTasks(response);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const filterTasks = () => {
    if (!searchTerm) {
      setFilteredTasks(tasks);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = tasks.filter(task => 
      task.title?.toLowerCase().includes(searchTermLower) ||
      task.description?.toLowerCase().includes(searchTermLower) ||
      task.assignedToName?.toLowerCase().includes(searchTermLower) ||
      task.status?.toLowerCase().includes(searchTermLower)
    );
    setFilteredTasks(filtered);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const refreshTasks = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const pendingTasks = filteredTasks.filter(task => task.status === 'PENDING').length;
  const inProgressTasks = filteredTasks.filter(task => task.status === 'IN_PROGRESS').length;
  const completedTasks = filteredTasks.filter(task => task.status === 'COMPLETED').length;

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <div className="admin-bg min-vh-100">
      <Navbar userType="admin" onLogout={onLogout} />
      <Container fluid className="py-4 px-4">
        <Row className="mb-4">
          <Col md={6}>
            <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Task Management</h4>
            <p className="text-muted small">Manage and monitor task progress</p>
          </Col>
          <Col md={6}>
            <InputGroup className="shadow-sm">
              <InputGroup.Text className="bg-white border-end-0">
                <BsSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search tasks by title, assignee, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0 ps-0"
                style={{ boxShadow: 'none' }}
              />
            </InputGroup>
          </Col>
        </Row>
        
       

       <Row className="g-4 mb-5">
          {[
            { 
              label: 'Pending', 
              count: pendingTasks, 
              icon: <BsHourglassSplit />,
              iconBg: '#f7f3e3',
              iconColor: '#d4b05c'
            },
            { 
              label: 'In Progress', 
              count: inProgressTasks, 
              icon: <BsArrowRepeat />,
              iconBg: '#e6efff',
              iconColor: '#4287f5'
            },
            { 
              label: 'Completed', 
              count: completedTasks, 
              icon: <BsCheckCircle />,
              iconBg: '#e6f7ee',
              iconColor: '#28a745'
            }
          ].map((status, index) => (
            <Col md={4} key={index}>
              <Card 
                className="border-0 shadow-sm h-100" 
                style={{ 
                  borderRadius: '15px',
                  backgroundColor: 'white',
                  transition: 'transform 0.2s ease-in-out',
                  cursor: 'pointer'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1">{status.label}</p>
                      <h2 className="fw-bold mb-0">{status.count}</h2>
                    </div>
                    <div 
                      className="rounded p-3"
                      style={{ 
                        backgroundColor: status.iconBg,
                        height: '60px',
                        width: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ color: status.iconColor, fontSize: '1.5rem' }}>
                        {status.icon}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            <Card 
              className="border-0 shadow-sm" 
              style={{ 
                borderRadius: '15px',
                background: 'white',
                marginTop: '30px',
              }}
            >
              <Card.Body className="p-4">
                <TaskList 
                  externalTasks={filteredTasks} 
                  onTaskUpdate={handleTaskUpdate} 
                  refreshTasks={refreshTasks}
                  isEmployeeView={false}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      </div>
    </DashboardLayout>
  );
};

export default AdminTaskDashboard;
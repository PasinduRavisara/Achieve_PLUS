import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Badge, ProgressBar, Form } from 'react-bootstrap';
import { BsCheckCircle, BsClock, BsArrowRepeat, BsTrophy, BsCalendar, BsGraphUp, 
         BsExclamationTriangle, BsLightning, BsStarFill, BsCalendarRange } from 'react-icons/bs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
         ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Navbar from '../components/layout/Navbar';
import { getCurrentUserTasks } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import '../styles/ProgressAnalysis.css';

const STATUS_COLORS = {
  'Completed': '#28a745',
  'In Progress': '#007bff',
  'Pending': '#ffc107',
  'Overdue': '#dc3545'
};

const ProgressAnalysis = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartData, setChartData] = useState({ completionTrend: [], pointsTrend: [] });

  

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

  useEffect(() => {
    if (tasks.length > 0) {
      prepareChartData();
    }
  }, [tasks, startDate, endDate]);

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

  const filterTasksByDateRange = (tasks) => {
    if (!startDate && !endDate) return tasks;

    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt || task.assignedAt || task.createdDate);
      
      if (startDate && endDate) {
        return taskDate >= startDate && taskDate <= endDate;
      } else if (startDate) {
        return taskDate >= startDate;
      } else if (endDate) {
        return taskDate <= endDate;
      }
      
      return true;
    });
  };

  const prepareChartData = () => {
    let filteredTasks = tasks;

    // Apply date range filter
    filteredTasks = filterTasksByDateRange(filteredTasks);

    // Group tasks by date
    const tasksByDate = {};
    const pointsByDate = {};
    
    filteredTasks.forEach(task => {
      const taskDate = new Date(task.createdAt || task.createdDate);
      const dateKey = taskDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Initialize if not exists
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = { completed: 0, inProgress: 0, pending: 0 };
      }
      if (!pointsByDate[dateKey]) {
        pointsByDate[dateKey] = 0;
      }
      
      // Count tasks by status
      if (task.status === 'COMPLETED') {
        tasksByDate[dateKey].completed += 1;
        pointsByDate[dateKey] += (task.points || 0);
      } else if (task.status === 'IN_PROGRESS') {
        tasksByDate[dateKey].inProgress += 1;
      } else if (task.status === 'PENDING' || task.status === 'New') {
        tasksByDate[dateKey].pending += 1;
      }
    });
    
    // Sort dates
    const sortedDates = Object.keys(tasksByDate).sort();
    
    // Create chart data arrays
    const completionTrend = sortedDates.map(date => ({
      date,
      Completed: tasksByDate[date].completed,
      'In Progress': tasksByDate[date].inProgress,
      Pending: tasksByDate[date].pending
    }));
    
    // Create cumulative points data
    let cumulativePoints = 0;
    const pointsTrend = sortedDates.map(date => {
      cumulativePoints += pointsByDate[date];
      return {
        date,
        'Daily Points': pointsByDate[date],
        'Cumulative Points': cumulativePoints
      };
    });
    
    setChartData({ completionTrend, pointsTrend });
  };

  const calculateStats = () => {
    let filteredTasks = tasks;

    // Apply date range filter
    filteredTasks = filterTasksByDateRange(filteredTasks);

    const overdueTasks = filteredTasks.filter(task => {
      if (task.status !== 'COMPLETED' && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return dueDate < new Date();
      }
      return false;
    });

    const completedTasks = filteredTasks.filter(task => task.status === 'COMPLETED');
    const avgCompletionTime = completedTasks.reduce((sum, task) => {
      const startDate = new Date(task.createdAt || task.assignedAt);
      const endDate = new Date(task.completedAt);
      return sum + (endDate - startDate) / (1000 * 60 * 60 * 24); // days
    }, 0) / (completedTasks.length || 1);

    const stats = {
      completed: completedTasks.length,
      inProgress: filteredTasks.filter(task => task.status === 'IN_PROGRESS').length,
      pending: filteredTasks.filter(task => task.status === 'PENDING' || task.status === 'New').length,
      overdue: overdueTasks.length,
      totalPoints: filteredTasks
        .filter(task => task.status === 'COMPLETED')
        .reduce((sum, task) => sum + (task.points || 0), 0),
      completionRate: filteredTasks.length > 0 
        ? Math.round((completedTasks.length / filteredTasks.length) * 100)
        : 0,
      avgCompletionTime: avgCompletionTime.toFixed(1),
      efficiency: completedTasks.length > 0 ? 
        Math.round((completedTasks.length / avgCompletionTime) * 100) : 0
    };

    return stats;
  };

  const stats = calculateStats();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <DashboardLayout sidebarItems={employeeSidebarItems}>
    <div className="min-vh-100  progress-analysis-bg ">
      <Navbar />
      <Container fluid className="px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-0">Progress Analysis</h1>
            <p className="text-muted">Track your performance and achievements</p>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <div className="d-flex gap-2">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="form-control"
                dateFormat="MMM dd, yyyy"
              />
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
                className="form-control"
                dateFormat="MMM dd, yyyy"
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={fetchTasks}
            >
              <BsArrowRepeat className="me-1" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                    <BsCheckCircle className="text-success fs-4" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Tasks Completed</h6>
                    <h3 className="mb-0">{stats.completed}</h3>
                    <div className="mt-2">
                      <ProgressBar 
                        now={stats.completionRate} 
                        variant="success" 
                        style={{ height: '4px' }} 
                      />
                    <small className="text-muted">{stats.completionRate}% completion rate</small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                    <BsArrowRepeat className="text-primary fs-4" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Tasks In Progress</h6>
                    <h3 className="mb-0">{stats.inProgress}</h3>
                    <div className="mt-2">
                      <Badge bg="primary" className="rounded-pill">
                        Active Tasks
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                    <BsExclamationTriangle className="text-danger fs-4" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Overdue Tasks</h6>
                    <h3 className="mb-0">{stats.overdue}</h3>
                    <div className="mt-2">
                      <Badge bg="danger" className="rounded-pill">
                        Needs Attention
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                    <BsTrophy className="text-info fs-4" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Points Earned</h6>
                    <h3 className="mb-0">{stats.totalPoints}</h3>
                    <div className="mt-2">
                      <Badge bg="info">
                        <BsStarFill className="me-1" />
                         Points
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-4">Task Completion Rate</h5>
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '300px' }}>
                  <div className="position-relative mb-4">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="position-relative">
                        <svg width="200" height="200" viewBox="0 0 200 200">
                          {/* Background circle */}
                          <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="#e9ecef"
                            strokeWidth="10"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke={stats.completionRate >= 75 ? '#28a745' : 
                                   stats.completionRate >= 50 ? '#ffc107' : '#dc3545'}
                            strokeWidth="10"
                            strokeDasharray={`${(stats.completionRate / 100) * 565.2} 565.2`}
                            strokeDashoffset="0"
                            transform="rotate(-90 100 100)"
                          />
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                          <h2 className="mb-0 fw-bold">{stats.completionRate}%</h2>
                          <p className="text-muted small mb-0">Completion Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="mb-2">
                      {stats.completed} of {stats.completed + stats.inProgress + stats.pending} Tasks
                    </h4>
                    <p className="text-muted mb-0">
                      {stats.completed} Completed • {stats.inProgress} In Progress • {stats.pending} Pending
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-4">Task Completion Trend</h5>
                {chartData.completionTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={chartData.completionTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`${value} tasks`, name]}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="Completed" stackId="a" fill={STATUS_COLORS['Completed']} />
                      <Bar dataKey="In Progress" stackId="a" fill={STATUS_COLORS['In Progress']} />
                      <Bar dataKey="Pending" stackId="a" fill={STATUS_COLORS['Pending']} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                    <p className="text-muted">No data available for selected time range</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-4">Points Progress</h5>
                {chartData.pointsTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={chartData.pointsTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`${value} points`, name]}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line 
                        type="monotone" 
                        dataKey="Daily Points" 
                        stroke="#17a2b8" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Cumulative Points" 
                        stroke="#28a745" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                    <p className="text-muted">No data available for selected time range</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </DashboardLayout>
  );
};

export default ProgressAnalysis;
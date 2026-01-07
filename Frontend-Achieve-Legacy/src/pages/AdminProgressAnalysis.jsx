import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge, Tabs, Tab, Table, ProgressBar } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
         PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis } from 'recharts';
import { BsCalendarWeek, BsCalendarMonth, BsCalendar3, BsArrowRepeat, BsGraphUp, 
         BsPeople, BsLightning, BsTrophy, BsExclamationTriangle, BsCheckCircle } from 'react-icons/bs';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getAllTasks } from '../api/tasks';
import { getAllUsers } from '../api/users';
import '../styles/ProgressAnalysis.css';

const AdminProgressAnalysis = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('month');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [taskStats, setTaskStats] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const adminSidebarItems = [
    { title: "Dashboard", path: "/admin-dashboard", icon: "bi-speedometer2" },
    { title: "Tasks", path: "/admin-tasks", icon: "bi-list-check" },
    { title: "Progress Analysis", path: "/admin-progress", icon: "bi-graph-up" },
    { title: "Leaderboard", path: "/leaderboard", icon: "bi-bar-chart-line" },
    { title: "Reward Store", path: "/admin-reward-store", icon: "bi-shop" },
    { title: "Employees", path: "/admin-employees", icon: "bi-people" },
    
  ];  

  const STATUS_COLORS = {
    'PENDING': '#FFBB28',
    'IN_PROGRESS': '#0088FE',
    'COMPLETED': '#00C49F',
    'OVERDUE': '#FF8042',
    'New': '#FFBB28'
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, timeFilter, selectedEmployee]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksData, usersData] = await Promise.all([
        getAllTasks(),
        getAllUsers()
      ]);

      if (Array.isArray(usersData)) {
        const employeesList = usersData.filter(user => 
          user.role === 'ROLE_EMPLOYEE' || 
          user.role === 'Employee' || 
          user.role === 'EMPLOYEE'
        );
        setUsers(employeesList);
      }

      generateTaskStats(tasksData || [], usersData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load progress data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const generateTaskStats = (tasksData, usersData) => {
    // Filter tasks based on selected employee
    const filteredTasks = selectedEmployee === 'all' 
      ? tasksData 
      : tasksData.filter(task => task.assignedTo === selectedEmployee);

    // Filter tasks based on time period
    const now = new Date();
    let cutoffDate = new Date();
    let previousPeriodStart = new Date();
    
    switch(timeFilter) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        previousPeriodStart.setDate(cutoffDate.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        previousPeriodStart.setMonth(cutoffDate.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        previousPeriodStart.setMonth(cutoffDate.getMonth() - 3);
        break;
      default:
        cutoffDate.setMonth(now.getMonth() - 1);
        previousPeriodStart.setMonth(cutoffDate.getMonth() - 1);
    }
    
    const timePeriodFilteredTasks = filteredTasks.filter(task => {
      const taskDate = new Date(task.createdAt || task.dueDate);
      return taskDate >= cutoffDate && taskDate <= now;
    });

    // Previous period tasks for comparison
    const previousPeriodTasks = filteredTasks.filter(task => {
      const taskDate = new Date(task.createdAt || task.dueDate);
      return taskDate >= previousPeriodStart && taskDate < cutoffDate;
    });

    // Calculate average completion time
    const currentCompletedTasks = timePeriodFilteredTasks.filter(task => task.status === 'COMPLETED' && task.completedAt);
    const previousCompletedTasks = previousPeriodTasks.filter(task => task.status === 'COMPLETED' && task.completedAt);
    
    const avgCompletionTime = currentCompletedTasks.reduce((sum, task) => {
      const startDate = new Date(task.createdAt || task.assignedAt);
      const endDate = new Date(task.completedAt);
      return sum + (endDate - startDate) / (1000 * 60 * 60); // hours
    }, 0) / (currentCompletedTasks.length || 1);
    
    const previousAvgCompletionTime = previousCompletedTasks.reduce((sum, task) => {
      const startDate = new Date(task.createdAt || task.assignedAt);
      const endDate = new Date(task.completedAt);
      return sum + (endDate - startDate) / (1000 * 60 * 60); // hours
    }, 0) / (previousCompletedTasks.length || 1);

    // Calculate difficulty-weighted productivity
    const calculateWeightedProductivity = (tasks) => {
      return tasks
        .filter(task => task.status === 'COMPLETED')
        .reduce((sum, task) => sum + (task.points || 1) * (task.difficulty || 1), 0);
    };
    
    const currentProductivity = calculateWeightedProductivity(timePeriodFilteredTasks);
    const previousProductivity = calculateWeightedProductivity(previousPeriodTasks);
    const productivityChange = previousProductivity === 0 ? 100 : 
      ((currentProductivity - previousProductivity) / previousProductivity) * 100;

    // Calculate status counts
    const statusCounts = {
      'PENDING': 0,
      'IN_PROGRESS': 0,
      'COMPLETED': 0,
      'OVERDUE': 0,
      'New': 0
    };

    // Mark overdue tasks
    timePeriodFilteredTasks.forEach(task => {
      let status = task.status || 'PENDING';
      
      // Check if task is overdue
      if (status !== 'COMPLETED' && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate < now) {
          status = 'OVERDUE';
        }
      }
      
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Prepare data for charts
    const statusData = Object.entries(statusCounts)
      .map(([status, count]) => ({
        name: status === 'PENDING' || status === 'New' ? 'Pending' : 
              status === 'IN_PROGRESS' ? 'In Progress' : 
              status === 'OVERDUE' ? 'Overdue' : 'Completed',
        value: count
      }))
      .filter(item => item.value > 0);

    // Group tasks by date for the timeline
    const tasksByDate = {};
    
    // Create a date range from cutoffDate to now
    const dateRange = [];
    const currentDate = new Date(cutoffDate);
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateRange.push(dateStr);
      tasksByDate[dateStr] = {
        date: dateStr,
        completed: 0,
        inProgress: 0,
        pending: 0
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in the actual task data
    timePeriodFilteredTasks.forEach(task => {
      const taskDate = new Date(task.createdAt || task.dueDate);
      const dateStr = taskDate.toISOString().split('T')[0];
      
      if (tasksByDate[dateStr]) {
      if (task.status === 'COMPLETED') {
        tasksByDate[dateStr].completed++;
        } else if (task.status === 'IN_PROGRESS') {
          tasksByDate[dateStr].inProgress++;
        } else {
          tasksByDate[dateStr].pending++;
        }
      }
    });

    // Convert to array and ensure dates are sorted
    const timelineDataArray = Object.values(tasksByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Calculate employee performance (for all employees view)
    const employeePerformance = users
      .filter(user => 
        user.role === 'ROLE_EMPLOYEE' || 
        user.role === 'Employee' || 
        user.role === 'EMPLOYEE'
      )
      .map(user => {
      const userTasks = tasksData.filter(task => task.assignedTo === user.id);
      
      // Apply the same time filter to employee tasks for fair comparison
      const timeFilteredUserTasks = userTasks.filter(task => {
        const taskDate = new Date(task.createdAt || task.dueDate);
          return taskDate >= cutoffDate && taskDate <= now;
      });
      
      const completedTasks = timeFilteredUserTasks.filter(task => task.status === 'COMPLETED');
      const inProgressTasks = timeFilteredUserTasks.filter(task => task.status === 'IN_PROGRESS');
      const pendingTasks = timeFilteredUserTasks.filter(task => 
        task.status === 'PENDING' || task.status === 'New'
      );
        const overdueTasks = timeFilteredUserTasks.filter(task => {
          if (task.status !== 'COMPLETED' && task.dueDate) {
            const dueDate = new Date(task.dueDate);
            return dueDate < now;
          }
          return false;
        });

      const totalPoints = timeFilteredUserTasks.reduce((sum, task) => sum + (task.points || 0), 0);
      const completedPoints = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0);
        
        // Calculate average task completion time
        const avgCompletionTime = completedTasks.reduce((sum, task) => {
          const startDate = new Date(task.createdAt || task.assignedAt);
          const endDate = new Date(task.completedAt);
          return sum + (endDate - startDate) / (1000 * 60 * 60 * 24); 
        }, 0) / (completedTasks.length || 1);

        // Calculate efficiency score
        const efficiency = completedTasks.length > 0 ? 
          completedPoints / (avgCompletionTime || 1) : 0;

      return {
        id: user.id,
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        totalTasks: timeFilteredUserTasks.length,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        pending: pendingTasks.length,
          overdue: overdueTasks.length,
        totalPoints,
        completedPoints,
          avgCompletionTime: avgCompletionTime.toFixed(1),
          efficiency: efficiency.toFixed(2),
        completionRate: timeFilteredUserTasks.length > 0 
          ? Math.round((completedTasks.length / timeFilteredUserTasks.length) * 100) 
          : 0
      };
      })
      .filter(emp => emp.totalTasks > 0) 
      .sort((a, b) => b.completionRate - a.completionRate);

    // Create skills breakdown
    const skillBreakdown = [];
    if (timeFilter !== 'all') {
      // Calculate skill distribution based on task categories or types
      const taskCategories = {};

      timePeriodFilteredTasks.forEach(task => {
        const category = task.category || task.type || 'Uncategorized';
        if (!taskCategories[category]) {
          taskCategories[category] = { name: category, completed: 0, total: 0 };
        }
        taskCategories[category].total++;
        if (task.status === 'COMPLETED') {
          taskCategories[category].completed++;
        }
      });

      Object.values(taskCategories).forEach(category => {
        category.completionRate = category.total > 0 
          ? Math.round((category.completed / category.total) * 100) 
          : 0;
        skillBreakdown.push(category);
      });
    }

    // Calculate overall metrics
    const totalTasks = timePeriodFilteredTasks.length;
    const totalCompletedTasks = timePeriodFilteredTasks.filter(task => task.status === 'COMPLETED').length;
    const totalInProgressTasks = timePeriodFilteredTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const totalPendingTasks = timePeriodFilteredTasks.filter(task => 
      task.status === 'PENDING' || task.status === 'New'
    ).length;
    const totalOverdueTasks = timePeriodFilteredTasks.filter(task => {
      if (task.status !== 'COMPLETED' && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return dueDate < now;
      }
      return false;
    }).length;

    const totalPoints = timePeriodFilteredTasks.reduce((sum, task) => sum + (task.points || 0), 0);
    const completedPoints = timePeriodFilteredTasks
      .filter(task => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.points || 0), 0);

    // Previous period metrics for comparison
    const prevTotalTasks = previousPeriodTasks.length;
    const prevCompletedTasks = previousPeriodTasks.filter(task => task.status === 'COMPLETED').length;
    const prevCompletionRate = prevTotalTasks > 0 ? (prevCompletedTasks / prevTotalTasks) * 100 : 0;
    const completionRateChange = prevCompletionRate === 0 ? 0 : 
      (((totalCompletedTasks / totalTasks) * 100 || 0) - prevCompletionRate);

    // Generate workload distribution
    const workloadDistribution = employeePerformance.map(emp => ({
      name: emp.name,
      taskCount: emp.totalTasks,
      completionRate: emp.completionRate
    }));

    // Get selected employee data if we're looking at an individual
    let selectedEmployeeData = null;
    if (selectedEmployee !== 'all') {
      const selectedUser = usersData.find(user => user.id === selectedEmployee);
      if (selectedUser) {
        // Get only the selected employee's tasks with time filter applied
        const selectedUserTasks = tasksData.filter(task => task.assignedTo === selectedEmployee);
        const timeFilteredSelectedUserTasks = selectedUserTasks.filter(task => {
          const taskDate = new Date(task.createdAt || task.dueDate);
          return taskDate >= cutoffDate && taskDate <= now;
        });
        
        // Calculate individual performance metrics
        const completedTasks = timeFilteredSelectedUserTasks.filter(task => task.status === 'COMPLETED');
        const inProgressTasks = timeFilteredSelectedUserTasks.filter(task => task.status === 'IN_PROGRESS');
        const pendingTasks = timeFilteredSelectedUserTasks.filter(task => 
          task.status === 'PENDING' || task.status === 'New'
        );
        const overdueTasks = timeFilteredSelectedUserTasks.filter(task => {
          if (task.status !== 'COMPLETED' && task.dueDate) {
            const dueDate = new Date(task.dueDate);
            return dueDate < now;
          }
          return false;
        });
        
        // Group tasks by date for the timeline
        const employeeTasksByDate = {};
        timeFilteredSelectedUserTasks.forEach(task => {
          const dateStr = new Date(task.createdAt || task.dueDate).toLocaleDateString();
          if (!employeeTasksByDate[dateStr]) {
            employeeTasksByDate[dateStr] = { date: dateStr, total: 0, completed: 0 };
          }
          employeeTasksByDate[dateStr].total++;
          if (task.status === 'COMPLETED') {
            employeeTasksByDate[dateStr].completed++;
          }
        });
        
        // Calculate skill proficiency
        const taskTypes = {};
        timeFilteredSelectedUserTasks.forEach(task => {
          const category = task.category || task.type || 'General';
          if (!taskTypes[category]) {
            taskTypes[category] = { name: category, completed: 0, total: 0 };
          }
          taskTypes[category].total++;
          if (task.status === 'COMPLETED') {
            taskTypes[category].completed++;
          }
        });
        
        const skillProficiency = Object.values(taskTypes).map(category => ({
          subject: category.name,
          A: category.total > 0 ? Math.round((category.completed / category.total) * 100) : 0,
          fullMark: 100
        }));
        
        // Calculate average task completion time
        const avgTaskTime = completedTasks.reduce((sum, task) => {
          const startDate = new Date(task.createdAt || task.assignedAt);
          const endDate = new Date(task.completedAt);
          return sum + (endDate - startDate) / (1000 * 60 * 60 * 24); // days
        }, 0) / (completedTasks.length || 1);
        
        selectedEmployeeData = {
          name: selectedUser.fullName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim(),
          totalTasks: timeFilteredSelectedUserTasks.length,
          completedTasks: completedTasks.length,
          inProgressTasks: inProgressTasks.length,
          pendingTasks: pendingTasks.length,
          overdueTasks: overdueTasks.length,
          completionRate: timeFilteredSelectedUserTasks.length > 0 
            ? Math.round((completedTasks.length / timeFilteredSelectedUserTasks.length) * 100) 
            : 0,
          avgTaskTime: avgTaskTime.toFixed(1),
          timelineData: Object.values(employeeTasksByDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date)),
          skillProficiency
        };
      }
    }

    setTaskStats({
      statusData,
      timelineData: timelineDataArray,
      employeePerformance,
      selectedEmployeeData,
      workloadDistribution,
      skillBreakdown,
      overallMetrics: {
        totalTasks,
        completedTasks: totalCompletedTasks,
        inProgressTasks: totalInProgressTasks,
        pendingTasks: totalPendingTasks,
        overdueTasks: totalOverdueTasks,
        totalPoints,
        completedPoints,
        avgCompletionTime: avgCompletionTime.toFixed(1),
        previousAvgCompletionTime: previousAvgCompletionTime.toFixed(1),
        completionTimeChange: ((avgCompletionTime - previousAvgCompletionTime) / previousAvgCompletionTime) * 100,
        completionRate: totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0,
        pointsCompletionRate: totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0,
        completionRateChange,
        productivityChange,
        prevTotalTasks,
        prevCompletedTasks
      }
    });
  };


  if (loading) {
    return (
      <DashboardLayout sidebarItems={adminSidebarItems}>
        <Navbar userType="admin" onLogout={onLogout} />
        <div className="d-flex justify-content-center align-items-center p-5">
          <div className="text-center">
            <Spinner animation="border" variant="primary" className="mb-2" />
            <p className="text-muted mb-0">Loading progress data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout sidebarItems={adminSidebarItems}>
        <Navbar userType="admin" onLogout={onLogout} />
        <Container fluid className="py-4 px-4">
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>Error Loading Data</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={handleRefresh}>
              <BsArrowRepeat className="me-2" />
              Try Again
            </Button>
          </Alert>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
       <div style={{ backgroundColor: '#e6f2ff', padding: '1.5rem' }} className="min-vh-100">
      <Navbar userType="admin" onLogout={onLogout} />

      <Container fluid className="py-4 px-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h4 className="fw-bold mb-1">Team Progress Analysis</h4>
                <p className="text-muted small">Comprehensive analytics on task completion and employee performance</p>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <Form.Group>
                  <Form.Select 
                    size="sm"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="rounded-pill px-4"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Select 
                    size="sm"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="rounded-pill px-4"
                  >
                    <option value="all">All Employees</option>
                    </Form.Select>
                </Form.Group>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="rounded-pill"
                  onClick={handleRefresh}
                >
                  <BsArrowRepeat className="me-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        {taskStats && (
          <Row className="g-3 mb-4">
                <Col xs={12} sm={6} md={3}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <div className="icon-bg bg-primary bg-opacity-10 p-3 me-3 rounded">
                        <i className="bi bi-list-check text-primary fs-4"></i>
                      </div>
                      <div>
                        <h3 className="mb-0 fw-bold">
                          {taskStats.overallMetrics.totalTasks}
                          <small className="text-muted ms-2 fs-6"> </small>
                        </h3>
                        <div className="text-muted small">Total Tasks</div>
                        <div className="small text-primary">
                          {taskStats.overallMetrics.completionRate}% completion rate
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={3}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <div className="icon-bg bg-success bg-opacity-10 p-3 me-3 rounded">
                        <BsCheckCircle className="text-success fs-4" />
                      </div>
                      <div>
                        <h3 className="mb-0 fw-bold">
                          {taskStats.overallMetrics.completedTasks}
                          <small className="text-muted ms-2 fs-6"> </small>
                        </h3>
                        <div className="text-muted small">Completed Tasks</div>
                        <div className="small text-success">
                          {taskStats.overallMetrics.pointsCompletionRate}% points earned
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={3}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <div className="icon-bg bg-warning bg-opacity-10 p-3 me-3 rounded">
                        <BsTrophy className="text-warning fs-4" />
                      </div>
                      <div>
                        <h3 className="mb-0 fw-bold">
                          {taskStats.overallMetrics.completedPoints}
                          <small className="text-muted ms-2 fs-6">                 
                          </small>
                        </h3>
                        <div className="text-muted small">Points Earned</div>
                        <div className="small text-warning">
                          From completed tasks
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={6} md={3}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                      <div className="icon-bg bg-danger bg-opacity-10 p-3 me-3 rounded">
                        <BsExclamationTriangle className="text-danger fs-4" />
                    </div>
                    <div>
                        <h3 className="mb-0 fw-bold">
                          {taskStats.overallMetrics.overdueTasks}
                          <small className="text-muted ms-2 fs-6">
                           </small>
                        </h3>
                        <div className="text-muted small">Current Overdue Tasks</div>
                        <div className="small text-danger">
                          Requires attention
                        </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
          </Row>
        )}

        {/* Charts */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-4">Task Status Distribution</h5>
                {taskStats && taskStats.statusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={taskStats.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                            outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taskStats.statusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                                fill={STATUS_COLORS[entry.name.toUpperCase()] || '#8884d8'} 
                          />
                        ))}
                      </Pie>
                          <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                      <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                        <p className="text-muted">No data available</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                    <h5 className="mb-4">Task Completion Timeline</h5>
                {taskStats && taskStats.timelineData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={taskStats.timelineData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date"
                            tickFormatter={(dateStr) => {
                              const date = new Date(dateStr);
                              return date.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric'
                              });
                            }}
                            interval="preserveStartEnd"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                      <YAxis />
                          <Tooltip 
                            labelFormatter={(dateStr) => {
                              const date = new Date(dateStr);
                              return date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              });
                            }}
                          />
                      <Legend />
                          <Area
                            type="monotone"
                            dataKey="completed"
                            stackId="1"
                            stroke="#28a745"
                            fill="#28a745"
                            name="Completed"
                          />
                          <Area
                            type="monotone"
                            dataKey="inProgress"
                            stackId="1"
                            stroke="#007bff"
                            fill="#007bff"
                            name="In Progress"
                          />
                          <Area
                            type="monotone"
                            dataKey="pending"
                            stackId="1"
                            stroke="#ffc107"
                            fill="#ffc107"
                            name="Pending"
                          />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                      <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                        <p className="text-muted">No data available</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Employee Performance Table */}
        {taskStats && taskStats.employeePerformance.length > 0 && (
          <Card className="border-0 shadow-sm mt-4">
                <Card.Body>
              <h5 className="mb-4">Employee Task Status Overview</h5>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Total Tasks</th>
                      <th>Completed</th>
                      <th>In Progress</th>
                      <th>Pending</th>
                      <th>Overdue</th>
                      <th>Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskStats.employeePerformance.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.totalTasks}</td>
                        <td>
                          <Badge bg="success" className="rounded-pill">
                            {emp.completed}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="primary" className="rounded-pill">
                            {emp.inProgress}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="warning" className="rounded-pill">
                            {emp.pending}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="danger" className="rounded-pill">
                            {emp.overdue}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 me-2" style={{ width: '100px' }}>
                              <ProgressBar 
                                now={emp.completionRate} 
                                variant={emp.completionRate >= 75 ? 'success' : 
                                       emp.completionRate >= 50 ? 'warning' : 'danger'} 
                                style={{ height: '6px' }}
                              />
                    </div>
                            <span className="text-muted small">{emp.completionRate}%</span>
                    </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                  </div>
                </Card.Body>
              </Card>
        )}
      </Container>
      </div>
    </DashboardLayout>
  );
};

export default AdminProgressAnalysis;
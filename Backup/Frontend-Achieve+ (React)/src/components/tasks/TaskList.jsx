import React, { useState, useEffect } from 'react';
import { Nav, Alert, Spinner, Badge, Table, Button, Modal } from 'react-bootstrap';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { getCurrentUserTasks } from '../../api/tasks';
import { BsCheckCircle, BsClock, BsListTask, BsArrowRepeat, BsPlus } from 'react-icons/bs';

const ResponsiveTaskList = ({ externalTasks, onTaskUpdate, refreshTasks, isEmployeeView = false }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (externalTasks) {
      setTasks(externalTasks);
      setLoading(false);
    } else {
      fetchTasks();
    }
  }, [externalTasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUserTasks();
      setTasks(response);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (refreshTasks) {
      refreshTasks();
    } else {
      fetchTasks();
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);

    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
  };

  const handleTaskCreated = () => {
    setShowCreateModal(false);
    if (refreshTasks) {
      refreshTasks();
    }
  };

  const getFilteredTasks = (status = null) => {
    if (!status || status === 'all') {
      return tasks;
    }
    return tasks.filter(task => {
      if (status === 'pending') {
        return task.status === 'PENDING' || task.status === 'New';
      }
      if (status === 'in_progress') {
        return task.status === 'IN_PROGRESS';
      }
      if (status === 'completed') {
        return task.status === 'COMPLETED';
      }
      return true;
    });
  };

  const getTaskStats = () => {
    return {
      all: tasks.length,
      pending: getFilteredTasks('pending').length,
      inProgress: getFilteredTasks('in_progress').length,
      completed: getFilteredTasks('completed').length
    };
  };

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks(activeTab);
  
  const statusColors = {
    all: { bg: 'secondary', bgLight: 'light', icon: <BsListTask className="me-2" /> },
    pending: { bg: 'warning', bgLight: 'warning bg-opacity-10', icon: <BsClock className="me-2" /> },
    in_progress: { bg: 'primary', bgLight: 'primary bg-opacity-10', icon: <BsArrowRepeat className="me-2" /> },
    completed: { bg: 'success', bgLight: 'success bg-opacity-10', icon: <BsCheckCircle className="me-2" /> }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <p className="text-muted mb-0">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="border-0 shadow-sm">
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>
            <p className="mb-0">{error}</p>
            <button 
              className="btn btn-sm btn-link text-danger p-0 mt-1" 
              onClick={() => setError('')}
            >
              Dismiss
            </button>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <div className="task-list mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="fw-bold mb-0">
            {activeTab === 'all' ? 'All Tasks' : 
             activeTab === 'pending' ? 'Pending Tasks' :
             activeTab === 'in_progress' ? 'In Progress Tasks' : 'Completed Tasks'}
          </h5>
          <p className="text-muted small mb-0">
            {filteredTasks.length} {activeTab === 'all' ? 'total' : activeTab} task{filteredTasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="d-flex gap-2">
          {!isEmployeeView && (
            <Button 
              variant="primary" 
              size="sm" 
              className="rounded-pill d-flex align-items-center gap-2 px-3"
              onClick={() => setShowCreateModal(true)}
            >
              <BsPlus className="fs-5" /> Create Task
            </Button>
          )}
          <button 
            className="btn btn-sm btn-outline-secondary rounded-pill d-flex align-items-center gap-2 px-3" 
            onClick={handleRefresh}
          >
            <BsArrowRepeat /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-light bg-opacity-50 rounded p-2 mb-4">
        <Nav 
          className="nav-pills-modern gap-2 flex-wrap" 
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
        >
          {['all', 'pending', 'in_progress', 'completed'].map(tab => {
            const { bg, icon } = statusColors[tab];
            const count = tab === 'all' ? stats.all : 
                         tab === 'pending' ? stats.pending :
                         tab === 'in_progress' ? stats.inProgress : stats.completed;
            
            return (
              <Nav.Item key={tab}>
                <Nav.Link 
                  eventKey={tab} 
                  className={`d-flex align-items-center px-3 py-2 rounded-pill ${activeTab === tab ? `bg-${bg} text-white` : 'text-dark'}`}
                >
                  {icon}
                  <span className="text-capitalize">{tab.replace('_', ' ')}</span>
                  <Badge 
                    bg={activeTab === tab ? 'light' : bg}
                    text={activeTab === tab ? 'dark' : 'white'}
                    className="ms-2 rounded-pill"
                  >
                    {count}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
      </div>

      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <div className="text-center p-3 bg-light bg-opacity-50 rounded">
            <div className="mb-3">
              <i className={`bi bi-inbox text-${statusColors[activeTab].bg} fs-1`}></i>
            </div>
            <h6 className="fw-semibold">No {activeTab === 'all' ? '' : activeTab.replace('_', ' ')} tasks {activeTab === 'all' ? 'available' : 'found'}</h6>
            <p className="text-muted small">
              {activeTab === 'all' ? (!isEmployeeView ? 'Create a new task to get started' : 'No tasks assigned yet') : 
               `Switch to another category${!isEmployeeView ? ' or create ' + activeTab.replace('_', ' ') + ' tasks' : ''}`}
            </p>
          </div>
        ) : (
          <>
            {isEmployeeView ? (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredTasks.map(task => (
                  <div key={task.id} className="col">
                    <TaskItem 
                      task={task} 
                      onStatusUpdate={handleTaskUpdate}
                      isAdminView={!isEmployeeView}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>Task ID</th>
                      <th>Assigned To</th>
                      <th>Title</th>
                      <th>Points</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onStatusUpdate={handleTaskUpdate}
                        isAdminView={!isEmployeeView}
                      />
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Task Modal */}
      {!isEmployeeView && (
        <Modal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default ResponsiveTaskList;
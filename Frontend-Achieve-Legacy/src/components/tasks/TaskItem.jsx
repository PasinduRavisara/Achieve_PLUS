import React, { useState } from 'react';
import { Card, Badge, Button, Spinner } from 'react-bootstrap';
import { updateTaskStatus } from '../../api/tasks';
import { BsClock, BsCalendar, BsPerson, BsPersonCheck, BsExclamationTriangle, BsTrophy } from 'react-icons/bs';

const TaskItem = ({ task, onStatusUpdate, isAdminView = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      const updatedTask = await updateTaskStatus(task.id, newStatus);
      if (onStatusUpdate) onStatusUpdate(updatedTask);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError(err.message || 'Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      case 'PENDING':
      case 'New':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'PENDING':
      case 'New':
        return 'Pending';
      default:
        return status;
    }
  };

  if (isAdminView) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
    const daysUntilDue = task.dueDate ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
      <tr className="align-middle" style={{ transition: 'background-color 0.2s ease' }}>
        <td className="py-3">
          <span className="text-muted">#{task.id}</span>
        </td>
        <td className="py-3">
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-light p-2 me-2">
              <BsPerson className="text-primary" />
            </div>
            <div>
              <div className="fw-medium">{task.assignedToName || task.assignedTo}</div>
              <div className="small text-muted">Assigned</div>
            </div>
          </div>
        </td>
        <td className="py-3">
          <div className="d-flex align-items-center">
            <div>
              <div className="fw-medium">{task.title}</div>
              <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>{task.description}</div>
            </div>
          </div>
        </td>
        <td className="py-3">
          {task.points ? (
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-info bg-opacity-10 p-2 me-2">
                <BsTrophy className="text-info" />
              </div>
              
                {task.points} pts
             </div>
          ) : (
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-light p-2 me-2">
                <BsTrophy className="text-muted" />
              </div>
              <span className="text-muted">-</span>
            </div>
          )}
        </td>
        <td className="py-3">
          <div className={`d-flex align-items-center ${isOverdue ? 'text-danger' : ''}`}>
            <div className={`rounded-circle p-2 me-2 ${isOverdue ? 'bg-danger bg-opacity-10' : 'bg-primary bg-opacity-10'}`}>
              <BsCalendar className={isOverdue ? 'text-danger' : 'text-primary'} />
            </div>
            <div>
              <div className="small">{formatDate(task.dueDate || task.createdAt)}</div>
              {daysUntilDue !== null && task.status !== 'COMPLETED' && (
                <div className={`smaller ${isOverdue ? 'text-danger' : 'text-muted'}`}>
                  {isOverdue 
                    ? `Overdue by ${Math.abs(daysUntilDue)} days`
                    : daysUntilDue === 0 
                      ? 'Due today'
                      : `Due in ${daysUntilDue} days`
                  }
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="py-3">
          <Badge 
            bg={getStatusBadgeVariant(task.status)}
            className={`rounded-pill px-3 py-1 ${isOverdue ? 'bg-danger' : ''}`}
            style={{ 
              boxShadow: isOverdue 
                ? '0 2px 4px rgba(220, 53, 69, 0.2)'
                : `0 2px 4px rgba(${getStatusBadgeVariant(task.status) === 'success' ? '25, 135, 84' : 
                                  getStatusBadgeVariant(task.status) === 'primary' ? '13, 110, 253' : 
                                  '255, 193, 7'}, 0.2)`
            }}
          >
            {getStatusText(task.status)}
            </Badge>
        </td>
      </tr>
    );
  }

  // Return the card design for employee views
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
  const isDueSoon = task.dueDate && !isOverdue && task.status !== 'COMPLETED' && 
    Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 3;
  
  const getStatusColor = () => {
    if (task.status === 'COMPLETED') return '#2d9464';
    if (task.status === 'IN_PROGRESS') return '#284d84';
    if (task.status === 'PENDING' && isOverdue) return '#dc3545';
    if (task.status === 'PENDING' && isDueSoon) return '#ffc107';
    return '#6c757d';
  };

  const getStatusGradient = () => {
    if (task.status === 'COMPLETED') return 'linear-gradient(to right, #23e389, #157347)';
    if (task.status === 'IN_PROGRESS') return 'linear-gradient(to right, #7ba6e6, #2b7cf7)';
    if (task.status === 'PENDING' && isOverdue) return 'linear-gradient(to right, #ff6b6b, #dc3545)';
    if (task.status === 'PENDING' && isDueSoon) return 'linear-gradient(to right, #ffd75e, #ffc107)';
    return 'linear-gradient(to right, #adb5bd, #6c757d)';
  };

  return (
    <Card 
      className="h-100 border-0 shadow-sm" 
      style={{ 
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: task.status === 'IN_PROGRESS' ? 'rgba(13, 110, 253, 0.02)' : 
                        task.status === 'COMPLETED' ? 'rgba(25, 135, 84, 0.02)' :
                        isDueSoon ? 'rgba(255, 193, 7, 0.02)' :
                        'white',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: getStatusGradient(),
        zIndex: 1
      }}></div>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div style={{ 
            position: 'relative', 
            paddingLeft: '12px',
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: '4px',
              bottom: '4px',
              width: '4px',
              backgroundColor: getStatusColor(),
              borderRadius: '2px'
            }}></div>
            <h5 className="fw-semibold mb-1">{task.title}</h5>
            <p className="text-muted small mb-0">{task.description}</p>
          </div>
          <Badge 
            bg={getStatusBadgeVariant(task.status)}
            className="rounded-pill px-3 py-2"
            style={{ 
              fontSize: '0.8rem',
              background: getStatusGradient(),
              color: task.status === 'PENDING' && !isOverdue && !isDueSoon ? '#000' : 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isOverdue ? 'Overdue' : isDueSoon ? 'Due Soon' : getStatusText(task.status)}
          </Badge>
        </div>
        
        <div className="d-flex align-items-center mb-3">
          <div className="me-4">
            <div className="d-flex align-items-center text-muted small">
              <BsCalendar className={`me-2 ${
                isOverdue ? 'text-danger' : 
                isDueSoon ? 'text-warning' : ''
              }`} />
              <span className={
                isOverdue ? 'text-danger' : 
                isDueSoon ? 'text-warning' : 'text-muted'
              }>
                {isOverdue ? 'Overdue' : isDueSoon ? 'Due Soon' : 'Due Date'}
              </span>
            </div>
            <div className={`fw-medium mt-1 ${
              isOverdue ? 'text-danger' : 
              isDueSoon ? 'text-warning' : ''
            }`}>
              {formatDate(task.dueDate)}
              {(isOverdue || isDueSoon) && task.status !== 'COMPLETED' && (
                <small className={`ms-2 ${isOverdue ? 'text-danger' : 'text-warning'}`}>
                  ({Math.abs(Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))} 
                  {isOverdue ? ' days ago' : ' days left'})
                </small>
              )}
            </div>
          </div>

          <div>
            <div className="d-flex align-items-center text-muted small">
              <BsPersonCheck className="me-2" />
              <span>Created by: {task.createdByName || 'Unknown'}</span>
              {task.createdBy === parseInt(localStorage.getItem('userId')) && (
                <Badge bg="secondary" className="ms-1 rounded-pill" style={{ fontSize: '0.7rem' }}>You</Badge>
              )}
            </div>
          </div>

          {task.points && (
            <div className="ms-auto">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-2">
                  <BsTrophy className="text-warning" />
                </div>
                <span className="fw-semibold">{task.points} points</span>
              </div>
            </div>
          )}
        </div>
        <div className="d-flex align-items-center text-muted small mb-3">
          <BsClock className="me-2" />
          <span>Created {formatDate(task.createdAt || task.createdDate)}</span>
        </div>
        
        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3 d-flex align-items-center" role="alert" style={{ fontSize: '0.8rem' }}>
            <BsExclamationTriangle className="me-2" /><small>{error}</small>
          </div>
        )}
        
        <div className="d-flex gap-2">
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <>
              {task.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  className="rounded-pill px-3"
                  style={{
                    background: 'transparent',
                    border: '1px solid #2a6ed6',
                    color: '#3572cd',
                    transition: 'background-color 0.3s, color 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#447bcf';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#246bd5';
                  }}
                >
                  Start
                </button>
              )}
              {task.status !== 'COMPLETED' && (
                <button
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  className="rounded-pill px-3"
                  style={{
                    background: 'transparent',
                    border: '1px solid #08aa5e',
                    color: '#0fa760',
                    transition: 'background-color 0.3s, color 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#56c18f';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0b7e49';
                  }}
                >
                  Complete
                </button>
              )}
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskItem;
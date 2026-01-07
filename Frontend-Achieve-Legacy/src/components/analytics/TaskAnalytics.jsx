import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { BsCheckCircle, BsClock, BsArrowRepeat, BsTrophy } from 'react-icons/bs';

const TaskAnalytics = ({ tasks }) => {
  // Calculate statistics
  const stats = {
    completed: tasks.filter(task => task.status === 'COMPLETED').length,
    inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
    pending: tasks.filter(task => task.status === 'PENDING' || task.status === 'New').length,
    totalPoints: tasks
      .filter(task => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.points || 0), 0)
  };

  const totalTasks = stats.completed + stats.inProgress + stats.pending;
  const completionRate = totalTasks > 0 ? Math.round((stats.completed / totalTasks) * 100) : 0;

  return (
    <div className="mb-4">
      <h4 className="mb-3">Progress Analytics</h4>
      <Row className="g-4">
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
                  <small className="text-muted">{completionRate}% completion rate</small>
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
                  <small className="text-muted">Currently working</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                  <BsClock className="text-warning fs-4" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Tasks Pending</h6>
                  <h3 className="mb-0">{stats.pending}</h3>
                  <small className="text-muted">Awaiting action</small>
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
                  <small className="text-muted">Total rewards</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskAnalytics; 
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Badge, Toast, Button } from "react-bootstrap";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const wellnessMessages = [
  {
    id: 1,
    message: "Time for a short break! Take 5 minutes to stretch and refresh.",
    type: "break",
    icon: "bi bi-clock-history",
  },
  {
    id: 2,
    message: "Stay hydrated! Don't forget to drink some water.",
    type: "hydration",
    icon: "bi bi-droplet-half",
  },
  {
    id: 3,
    message: "Take a moment to practice deep breathing exercises.",
    type: "stress",
    icon: "bi bi-wind",
  },
  {
    id: 4,
    message: "Remember to maintain good posture while working.",
    type: "posture",
    icon: "bi bi-person-standing",
  },
  {
    id: 5,
    message: "Consider taking a short walk to boost your energy.",
    type: "movement",
    icon: "bi bi-shoe-prints",
  },
  {
    id: 6,
    message: "Time to check your screen distance and lighting.",
    type: "eye-care",
    icon: "bi bi-eye",
  },
];

const EmployeeWellness = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

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
    const showRandomMessage = () => {
      const randomIndex = Math.floor(Math.random() * wellnessMessages.length);
      const message = wellnessMessages[randomIndex];
      setCurrentMessage(message);
      setShowToast(true);

      setNotifications((prev) => [
        {
          ...message,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    showRandomMessage();
    const interval = setInterval(showRandomMessage, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeColor = (type) => {
    const colors = {
      break: "primary",
      hydration: "info",
      stress: "warning",
      posture: "success",
      movement: "danger",
      "eye-care": "secondary",
    };
    return colors[type] || "primary";
  };

  return (
    <DashboardLayout sidebarItems={employeeSidebarItems}>
      <div className="bg-light min-vh-100">
        <div className="pt-3 pb-2 px-4 bg-gradient bg-primary bg-opacity-10 border-bottom border-primary border-opacity-25 mb-3">
          <h4 className="mb-1 d-flex align-items-center">
            <i className="bi bi-heart-pulse-fill text-primary me-2"></i>
            Employee Wellness Hub
          </h4>
          <p className="text-muted mb-0 small">
            <i className="bi bi-info-circle me-1"></i>
            Reminders and tips to help maintain your wellbeing at work
          </p>
        </div>
        
        <Container fluid className="px-4 pb-4">
        <Row className="g-3 ms-6">
        {/* Notification History */}
            <Col md={8}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-primary text-white py-2 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-bell-fill me-2"></i>
                    <h5 className="mb-0">Wellness Notifications History</h5>
                  </div>
                  <Badge bg="light" text="primary" className="d-flex align-items-center">
                    <i className="bi bi-list-ul me-1"></i>
                    {notifications.length}
                  </Badge>
                </Card.Header>
                <ListGroup variant="flush" className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  {notifications.map((notification, index) => (
                    <ListGroup.Item
                      key={index}
                      className="py-2 px-3 border-start border-3 border-light border-opacity-50 hover-shadow"
                      style={{ 
                        transition: "all 0.2s ease",
                        borderLeftColor: `var(--bs-${getBadgeColor(notification.type)})` 
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="mb-1 d-flex align-items-center">
                            <span className={`me-2 rounded-circle text-white p-1 d-inline-flex align-items-center justify-content-center`} style={{ 
                              backgroundColor: `var(--bs-${getBadgeColor(notification.type)})`,
                              width: "28px",
                              height: "28px"
                            }}>
                              <i className={`${notification.icon} small`}></i>
                            </span>
                            <span>{notification.message}</span>
                          </div>
                          <small className="text-muted d-flex align-items-center">
                            <i className="bi bi-clock me-1"></i>
                            {new Date(notification.timestamp).toLocaleString()}
                          </small>
                        </div>
                        <Badge bg={getBadgeColor(notification.type)} className="text-capitalize d-flex align-items-center">
                          <i className={`bi ${getBadgeTypeIcon(notification.type)} me-1`}></i>
                          {notification.type}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                  {notifications.length === 0 && (
                    <ListGroup.Item className="text-center py-4">
                      <i className="bi bi-inbox text-secondary fs-3 mb-2 d-block"></i>
                      <p className="mb-0">No notifications yet</p>
                      <p className="text-muted small mb-0">Wellness reminders will appear here hourly</p>
                    </ListGroup.Item>
                  )}
                </ListGroup>
                <Card.Footer className="bg-light border-0 py-2">
                  <div className="d-flex align-items-center justify-content-between small">
                    <span className="text-muted d-flex align-items-center">
                      <i className="bi bi-info-circle me-1"></i>
                      Reminders refresh hourly
                    </span>
                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Refresh
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>

            {/* Tips Card */}
            <Col md={4}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-success text-white py-2 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-lightbulb-fill me-2"></i>
                    <h5 className="mb-0">Wellness Tips</h5>
                  </div>
                  <span className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px" }}>
                    <i className="bi bi-5-circle-fill"></i>
                  </span>
                </Card.Header>
                <Card.Body className="py-3">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3 d-flex">
                      <div className="me-3">
                        <span className="rounded-circle bg-primary bg-opacity-10 p-2 d-inline-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                          <i className="bi bi-clock text-primary"></i>
                        </span>
                      </div>
                      <div>
                        <strong>Take regular breaks</strong>
                        <p className="mb-0 small text-muted">Stand up and stretch every hour</p>
                      </div>
                    </li>
                    <li className="mb-3 d-flex">
                      <div className="me-3">
                        <span className="rounded-circle bg-info bg-opacity-10 p-2 d-inline-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                          <i className="bi bi-droplet-fill text-info"></i>
                        </span>
                      </div>
                      <div>
                        <strong>Stay hydrated</strong>
                        <p className="mb-0 small text-muted">Drink water throughout the day</p>
                      </div>
                    </li>
                    <li className="mb-3 d-flex">
                      <div className="me-3">
                        <span className="rounded-circle bg-warning bg-opacity-10 p-2 d-inline-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                          <i className="bi bi-activity text-warning"></i>
                        </span>
                      </div>
                      <div>
                        <strong>Move your body</strong>
                        <p className="mb-0 small text-muted">Practice simple desk exercises</p>
                      </div>
                    </li>
                    <li className="mb-3 d-flex">
                      <div className="me-3">
                        <span className="rounded-circle bg-secondary bg-opacity-10 p-2 d-inline-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                          <i className="bi bi-eye text-secondary"></i>
                        </span>
                      </div>
                      <div>
                        <strong>Rest your eyes</strong>
                        <p className="mb-0 small text-muted">Follow the 20-20-20 rule for eye care</p>
                      </div>
                    </li>
                    <li className="mb-0 d-flex">
                      <div className="me-3">
                        <span className="rounded-circle bg-success bg-opacity-10 p-2 d-inline-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                          <i className="bi bi-person-standing text-success"></i>
                        </span>
                      </div>
                      <div>
                        <strong>Check your posture</strong>
                        <p className="mb-0 small text-muted">Maintain good alignment at your desk</p>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
                <Card.Footer className="bg-light text-center border-0">
                  <Button variant="success" size="sm" className="w-100 d-flex align-items-center justify-content-center">
                    <i className="bi bi-journal-check me-1"></i>
                    View All Wellness Resources
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>

          {/* Toast Notification */}
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={5000}
            autohide
            className="position-fixed bottom-0 end-0 m-3 shadow-lg"
          >
            <Toast.Header closeButton className="bg-light">
              <i className="bi bi-heart-pulse-fill text-success me-2"></i>
              <strong className="me-auto">Wellness Reminder</strong>
              <Badge bg={getBadgeColor(currentMessage?.type)} className="text-capitalize ms-2 d-flex align-items-center">
                <i className={`bi ${getBadgeTypeIcon(currentMessage?.type)} me-1`}></i>
                {currentMessage?.type}
              </Badge>
            </Toast.Header>
            <Toast.Body className="d-flex align-items-center bg-white">
              <span className={`me-2 rounded-circle text-white p-2 d-inline-flex align-items-center justify-content-center`} style={{ 
                backgroundColor: `var(--bs-${getBadgeColor(currentMessage?.type)})`,
                width: "32px",
                height: "32px"
              }}>
                <i className={`${currentMessage?.icon}`}></i>
              </span>
              <span>{currentMessage?.message}</span>
            </Toast.Body>
          </Toast>
        </Container>
      </div>
    </DashboardLayout>
  );
};

// Helper function to get appropriate icons for badge types
const getBadgeTypeIcon = (type) => {
  const icons = {
    break: "bi-clock-history",
    hydration: "bi-droplet-half",
    stress: "bi-wind",
    posture: "bi-person-standing",
    movement: "bi-shoe-prints",
    "eye-care": "bi-eye",
  };
  return icons[type] || "bi-heart-pulse";
};

export default EmployeeWellness;
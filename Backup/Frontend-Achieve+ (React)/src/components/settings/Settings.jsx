import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { currentUser, updatePassword, updateNotificationPreferences } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: currentUser?.preferences?.emailNotifications || false,
    pushNotifications: currentUser?.preferences?.pushNotifications || true,
    taskReminders: currentUser?.preferences?.taskReminders || true,
    weeklyDigest: currentUser?.preferences?.weeklyDigest || false,
    achievementAlerts: currentUser?.preferences?.achievementAlerts || true
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }
    
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    
    try {
      await updatePassword(oldPassword, newPassword);
      setSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password. ' + err.message);
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const saveNotificationPreferences = async () => {
    setError('');
    setSuccess('');
    
    try {
      await updateNotificationPreferences(notifications);
      setSuccess('Notification preferences updated successfully!');
    } catch (err) {
      setError('Failed to update notification preferences. ' + err.message);
    }
  };

  return (
    <Container className="mt-4 mb-5 pb-5">
      <h4 className="mb-4">Settings</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Account Settings</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordChange}>
                <h6 className="mb-3">Change Password</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                  Update Password
                </Button>
              </Form>
              
              <hr className="my-4" />
              
              <h6 className="mb-3">Danger Zone</h6>
              <Button variant="outline-danger">
                Delete Account
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Notification Preferences</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Form.Check 
                  type="switch"
                  id="emailNotifications"
                  name="emailNotifications"
                  label="Email Notifications"
                  checked={notifications.emailNotifications}
                  onChange={handleNotificationChange}
                  className="py-2"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Check 
                  type="switch"
                  id="pushNotifications"
                  name="pushNotifications"
                  label="Push Notifications"
                  checked={notifications.pushNotifications}
                  onChange={handleNotificationChange}
                  className="py-2"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Check 
                  type="switch"
                  id="taskReminders"
                  name="taskReminders"
                  label="Task Reminders"
                  checked={notifications.taskReminders}
                  onChange={handleNotificationChange}
                  className="py-2"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Check 
                  type="switch"
                  id="weeklyDigest"
                  name="weeklyDigest"
                  label="Weekly Progress Digest"
                  checked={notifications.weeklyDigest}
                  onChange={handleNotificationChange}
                  className="py-2"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Check 
                  type="switch"
                  id="achievementAlerts"
                  name="achievementAlerts"
                  label="Achievement Alerts"
                  checked={notifications.achievementAlerts}
                  onChange={handleNotificationChange}
                  className="py-2"
                />
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-end">
                <Button variant="primary" onClick={saveNotificationPreferences}>
                  Save Preferences
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          
          <Card className="shadow-sm mt-4">
            <Card.Header>
              <h5 className="mb-0">Theme Preferences</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>App Theme</Form.Label>
                <Form.Select defaultValue="light">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </Form.Select>
              </Form.Group>
              
              <div className="d-flex justify-content-end mt-3">
                <Button variant="primary">
                  Save Theme
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
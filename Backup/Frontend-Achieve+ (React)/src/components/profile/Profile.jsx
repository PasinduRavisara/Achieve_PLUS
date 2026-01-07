import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await updateProfile({
        fullName,
        email,
        bio,
        phoneNumber
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. ' + err.message);
    }
  };

  return (
    <Container className="mt-4 mb-5 pb-5">
      <h4 className="mb-4">My Profile</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-4">
            <Col xs={4} md={3} className="text-center">
              <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-2" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-person-fill fs-1"></i>
              </div>
              {!isEditing && (
                <Button variant="outline-primary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </Col>
            <Col xs={8} md={9}>
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control 
                      type="tel" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                    />
                  </Form.Group>
                  
                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="light" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <h5>{currentUser?.fullName}</h5>
                  <p className="text-muted mb-1">{currentUser?.email}</p>
                  {currentUser?.phoneNumber && (
                    <p className="text-muted mb-1">{currentUser?.phoneNumber}</p>
                  )}
                  <p className="text-muted mb-0">{currentUser?.isAdmin ? 'Administrator' : 'Team Member'}</p>
                  
                  {currentUser?.bio && (
                    <div className="mt-3">
                      <p>{currentUser.bio}</p>
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
          
          {!isEditing && (
            <>
              <hr />
              <h6 className="mb-3">Activity Overview</h6>
              <Row>
                <Col xs={6} md={3} className="text-center mb-3">
                  <div className="border rounded p-3">
                    <h3 className="text-primary mb-1">{currentUser?.stats?.completedTasks || 0}</h3>
                    <small className="text-muted">Completed Tasks</small>
                  </div>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <div className="border rounded p-3">
                    <h3 className="text-primary mb-1">{currentUser?.stats?.streakDays || 0}</h3>
                    <small className="text-muted">Day Streak</small>
                  </div>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <div className="border rounded p-3">
                    <h3 className="text-primary mb-1">{currentUser?.stats?.badges || 0}</h3>
                    <small className="text-muted">Badges</small>
                  </div>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <div className="border rounded p-3">
                    <h3 className="text-primary mb-1">{currentUser?.stats?.points || 0}</h3>
                    <small className="text-muted">Points</small>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
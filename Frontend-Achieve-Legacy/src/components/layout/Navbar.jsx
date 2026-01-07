import React from 'react';
import { Navbar as BsNavbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();

  return (
    <BsNavbar 
      bg="white" 
      expand="lg" 
      className="border-bottom shadow-sm"
      style={{ 
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        height: '60px', 
        padding: '0.5rem 0'
      }}
    >
      <Container fluid className="px-4">
        <BsNavbar.Brand href="#" className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <span className="fw-bold h4 logo-text mb-0">
          
            </span>
          </div>
        </BsNavbar.Brand>
        
        <Nav className="d-flex align-items-center ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="light" 
              id="dropdown-basic" 
              className="d-flex align-items-center border-0 rounded-pill px-3 py-2"
              style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div 
                className="d-flex align-items-center bg-primary justify-content-center rounded-circle text-white me-2" 
                style={{ 
                  width: '38px', 
                  height: '38px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)'
                }}
              >
                <i className="bi bi-person-fill"></i>
              </div>
              <span className="d-md-inline d-none">
                <span className="fw-semibold">{currentUser?.fullName}</span>
                <small className="d-block text-muted">{isAdmin ? 'Admin' : 'Employee'}</small>
              </span>
            </Dropdown.Toggle>
            
            <Dropdown.Menu 
              className="border-0 p-2 rounded-4 shadow-lg mt-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                minWidth: '220px',
                position: 'absolute',
                right: 0,
                zIndex: 1050
              }}
            >
              <div className="mb-2 px-3 py-2">
                <p className="text-dark fw-medium mb-0">{currentUser?.fullName}</p>
                <p className="text-muted mb-0 small">{currentUser?.email}</p>
              </div>
              <Dropdown.Item href="/profile" className="rounded-3 mb-1 px-3 py-2 transition-all">
                <i className="text-primary bi bi-person me-2"></i>
                <span className="fw-medium">Profile</span>
              </Dropdown.Item>
              <Dropdown.Item href="/settings" className="rounded-3 mb-1 px-3 py-2 transition-all">
                <i className="text-primary bi bi-gear me-2"></i>
                <span className="fw-medium">Settings</span>
              </Dropdown.Item>
              <Dropdown.Divider className="my-2 opacity-25" />
              <Dropdown.Item onClick={logout} className="rounded-3 text-danger px-3 py-2 transition-all">
                <i className="bi bi-box-arrow-right me-2"></i>
                <span className="fw-medium">Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
      
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .transition-all {
          transition: all 0.2s ease;
        }
        
        .transition-all:hover {
          background-color: rgba(71, 118, 230, 0.1);
          transform: translateX(2px);
        }
        
        .dropdown-item:active {
          background-color: rgba(71, 118, 230, 0.2);
        }
        
        .logo-text {
          letter-spacing: -0.5px;
        }
        
        /* Fix dropdown visibility */
        .dropdown-menu.show {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
      `}</style>
    </BsNavbar>
  );
};

export default Navbar;
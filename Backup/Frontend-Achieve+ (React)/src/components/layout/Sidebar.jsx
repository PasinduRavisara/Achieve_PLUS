import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Sidebar.css';
import logo1 from "../../assets/logo1.png";

const Sidebar = ({ items }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="sidebar bg-primary text-white">
      <div className="text-center mb-3">
          <img 
            src={logo1} 
            alt="Achieve+" 
            className="brand-logo" 
            style={{ maxWidth: '120px', height: 'auto' }} 
          />
        </div>

      <Nav className="flex-column">
        {items.map((item, index) => (
          <Nav.Item key={index}>
            <Nav.Link
  as={Link}
  to={item.path}
  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
>
  <i className={`bi ${item.icon}`}></i>
  <span>{item.title}</span>
</Nav.Link>

          </Nav.Item>
        ))}
      </Nav>
      <div className="mt-auto p-3">
        <Button 
          variant="outline-light" 
          className="w-100"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 
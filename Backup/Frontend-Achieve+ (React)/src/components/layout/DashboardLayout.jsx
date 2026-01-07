import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; 
import '../../styles/DashboardLayout.css';
import '../../styles/Dashboard.css';

const DashboardLayout = ({ sidebarItems, children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar items={sidebarItems} />
      <div className="dashboard-main">
        <Navbar /> 
        <main className="dashboard-content">
          <Container fluid>
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Table,
  Badge,
  Card,
} from "react-bootstrap";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../api/users";
import Navbar from '../components/layout/Navbar';
import "../styles/AdminStyles.css";
import "../styles/AdminEmployeesDetails.css";
import employeesImage from '../assets/employees.png';

const adminSidebarItems = [
  { title: "Dashboard", path: "/admin-dashboard", icon: "bi-speedometer2" },
  { title: "Tasks", path: "/admin-tasks", icon: "bi-list-check" },
  { title: "Progress Analysis", path: "/admin-progress", icon: "bi-graph-up" },
  { title: "Leaderboard", path: "/leaderboard", icon: "bi-bar-chart-line" },
  { title: "Reward Store", path: "/admin-reward-store", icon: "bi-shop" },
  { title: "Employees", path: "/admin-employees", icon: "bi-people" },
  
];

const AdminEmployees = ({ onLogout }) => {
  const { currentUser } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid data format received');
      }

      // Filter and map the response to get only employees
      const employeesList = response
        .filter(user => {
          // Check for different role formats
          const role = String(user.role || '').toLowerCase();
          return role.includes('employee') || role === 'user';
        })
        .map(user => ({
          id: user.id,
          fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          role: user.role || 'ROLE_EMPLOYEE',
          status: user.status || 'active',
          joinDate: user.createdAt || new Date().toISOString(),
        }));

      setEmployees(employeesList);
      setError("");
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.message || "Failed to fetch employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <div className="admin-bg">
        <Navbar userType="admin" onLogout={onLogout} />
        <Container fluid className="py-4">
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h2 className="fw-bold text-primary mb-0">Employee Management</h2>
                  <p className="text-muted mt-2 mb-0">View team members</p>
                </Col>
                <Col md={4} className="text-end">
                  <img
                    src={employeesImage}
                    alt="employees"
                    className="img-employees"
                    style={{ maxHeight: '150px' }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible className="mb-4">
              {error}
            </Alert>
          )}

          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="modern-employee-table mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Join Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td className="fw-medium">{employee.fullName}</td>
                          <td>{employee.email}</td>
                          <td>
                            <Badge pill bg={employee.role === "ROLE_ADMIN" ? "primary" : "info"} className="px-3 py-2">
                              {employee.role === "ROLE_ADMIN" ? "Admin" : "Employee"}
                            </Badge>
                          </td>
                          <td>{new Date(employee.joinDate).toLocaleDateString()}</td>
                          <td>
                            <Badge pill bg={employee.status === "active" ? "success" : "danger"} className="px-3 py-2">
                              {employee.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default AdminEmployees;


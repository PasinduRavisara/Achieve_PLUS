import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { createTask } from '../../api/tasks';
import { getAllUsers } from '../../api/users';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: '',
    assignedTo: ''
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState('');
  const [dateError, setDateError] = useState('');


   // Get today's date in YYYY-MM-DD format for min attribute
   const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      setEmployeesError('');
      
      console.log('Fetching users for employee dropdown...');
      const response = await getAllUsers();
      console.log('Raw users response:', response);
      
      if (!Array.isArray(response)) {
        console.error('Response is not an array:', response);
        setEmployeesError('Invalid data format received');
        setEmployees([]);
        return;
      }
      
      console.log('Filtering for employees from users:', response);
      
      // Filter for employees and log each user's role for debugging
      response.forEach(currentUser => {
        console.log(`User ${currentUser.email} has role: ${currentUser.role}`);
      });
      
      const employeesList = response
        .filter(currentUser => {
          // Check for different role formats
          const isEmployee = 
            currentUser.role === 'ROLE_EMPLOYEE' || 
            currentUser.role === 'Employee' || 
            currentUser.role === 'EMPLOYEE';
          
          console.log(`User ${currentUser.email} isEmployee: ${isEmployee}`);
          return isEmployee;
        })
        .map(user => ({
          id: user.id,
          name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email
        }));
      
      console.log('Filtered employees:', employeesList);
      
      if (employeesList.length === 0) {
        console.warn('No employees found after filtering');
        setEmployeesError('No employees available');
      } else {
        console.log(`Found ${employeesList.length} employees`);
        setEmployeesError('');
      }
      
      setEmployees(employeesList);
    } catch (err) {
      console.error('Error in fetchEmployees:', err);
      setEmployeesError(err?.message || 'Failed to load employees');
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the field is dueDate, validate it's not in the past
    if (name === 'dueDate') {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); 
      
      if (selectedDate < currentDate) {
        setDateError('Due date cannot be in the past');
      } else {
        setDateError('');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date before submission
    const selectedDate = new Date(formData.dueDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < currentDate) {
      setDateError('Due date cannot be in the past');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setDateError('');


    try {
      const taskData = {
        ...formData,
        points: parseInt(formData.points, 10)
      };
      
      const newTask = await createTask(taskData);
      
      // Add a check before calling onTaskCreated
      if (typeof onTaskCreated === 'function') {
        onTaskCreated(newTask);
      }
      
      setSuccessMessage('Task created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        points: '',
        assignedTo: ''
      });
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  if (employeesLoading && !employees.length) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" size="sm" />
        <span className="ms-2">Loading employees...</span>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
      {employeesError && <Alert variant="warning" className="mb-3">{employeesError}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={3}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          min={today} 
          isInvalid={!!dateError}
          required
        />
        {dateError && (
          <Form.Control.Feedback type="invalid">
            {dateError}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Points</Form.Label>
        <Form.Control
          type="number"
          name="points"
          value={formData.points}
          onChange={handleChange}
          placeholder="Enter points value"
          min="0"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Assign To</Form.Label>
        {employeesLoading ? (
          <div className="d-flex align-items-center">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Loading employees...</span>
          </div>
        ) : (
          <>
            <Form.Select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              isInvalid={!!employeesError && employees.length === 0}
            >
              <option value="">Select an employee</option>
              {employees.length > 0 ? (
                employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.email})
                  </option>
                ))
              ) : (
                <option value="" disabled>No employees available</option>
              )}
            </Form.Select>
            {employeesError && employees.length === 0 && (
              <Form.Control.Feedback type="invalid">
                {employeesError}
              </Form.Control.Feedback>
            )}
          </>
        )}
      </Form.Group>

      <div className="d-grid">
        <Button 
          variant="primary" 
          type="submit"
          disabled={loading || (employees.length === 0 && !employeesLoading)}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Creating Task...
            </>
          ) : (
            'Create Task'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default TaskForm;











































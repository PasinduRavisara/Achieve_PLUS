import React, { useState, useEffect } from "react";
import { Card, Button, Form, ListGroup, Badge } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    id: null,
    text: "",
    date: new Date(),
    priority: "medium",
  });

  useEffect(() => {
    const savedReminders = localStorage.getItem("adminReminders");
    if (savedReminders) {
      const parsedReminders = JSON.parse(savedReminders).map((reminder) => ({
        ...reminder,
        date: new Date(reminder.date),
      }));
      setReminders(parsedReminders);
    }
  }, []);

  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("adminReminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  const handleAddReminder = () => {
    if (newReminder.text.trim() === "") return;

    const reminderToAdd = { ...newReminder, id: Date.now() };
    setReminders([...reminders, reminderToAdd]);
    setNewReminder({ id: null, text: "", date: new Date(), priority: "medium" });
    setShowAddForm(false);
  };

  const handleDeleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const sortedReminders = [...reminders].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Card className="border-0 shadow-lg h-100 rounded-4">
      <Card.Header className="text-black py-3 rounded-top-4" style={{ background: "linear-gradient(135deg,rgb(233, 237, 238),rgb(225, 226, 154))" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-sticky text-warning me-2"></i>
            Reminders & Notes
          </h5>
          <Button
            variant="light"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="d-flex align-items-center gap-1 rounded-pill"
          >
            <i className={`bi ${showAddForm ? "bi-x-lg" : "bi-plus-lg"} me-1`}></i>
            {showAddForm ? "Cancel" : "New Reminder"}
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        {showAddForm && (
          <div className="p-4 bg-light border-bottom rounded-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Reminder</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter your reminder note"
                value={newReminder.text}
                onChange={(e) => setNewReminder({ ...newReminder, text: e.target.value })}
                className="shadow-sm rounded-3"
              />
            </Form.Group>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-medium">Date</Form.Label>
                  <DatePicker
                    selected={newReminder.date}
                    onChange={(date) => setNewReminder({ ...newReminder, date })}
                    className="form-control shadow-sm rounded-3"
                    dateFormat="MMM d, yyyy"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-medium">Priority</Form.Label>
                  <Form.Select
                    value={newReminder.priority}
                    onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value })}
                    className="shadow-sm rounded-3"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <Button variant="primary" onClick={handleAddReminder} className="rounded-pill px-4">
                Save Reminder
              </Button>
            </div>
          </div>
        )}

        {sortedReminders.length === 0 ? (
          <div className="p-4 text-center text-muted">
            <i className="bi bi-journal-text fs-3 mb-2"></i>
            <p>No reminders yet.Add a new reminder to get started and stay on top of your tasks.</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {sortedReminders.map((reminder) => (
              <ListGroup.Item key={reminder.id} className="border-0 px-3 py-3 rounded-3 mb-2 shadow-sm bg-light">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-2">
                    <div className="d-flex align-items-center mb-1">
                      <Badge bg={getPriorityColor(reminder.priority)} className="me-2 px-2 py-1 rounded-pill">
                        {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                      </Badge>
                      <small className="text-muted">
                        <i className="bi bi-calendar-date me-1"></i>
                        {formatDate(reminder.date)}
                      </small>
                    </div>
                    <p className="mb-0">{reminder.text}</p>
                  </div>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={() => handleDeleteReminder(reminder.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>

      {sortedReminders.length > 0 && (
        <Card.Footer className="bg-white border-0 p-3 text-end rounded-bottom-4">
          <Button variant="outline-secondary" size="sm" className="rounded-pill">
            View All Reminders
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default AdminReminders;

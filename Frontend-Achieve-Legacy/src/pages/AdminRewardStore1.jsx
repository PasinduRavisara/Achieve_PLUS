import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
  Table,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import rewardsApi from "../api/rewards";
import { useAuth } from "../context/AuthContext";
import "../styles/RewardStore.css";

const AdminRewardStore = () => {
  const { currentUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pointsCost: "",
    quantity: "",
    imageUrl: "",
  });

  const adminSidebarItems = [
    { title: "Dashboard", path: "/admin-dashboard", icon: "bi-speedometer2" },
    { title: "Tasks", path: "/admin-tasks", icon: "bi-list-check" },
    { title: "Progress Analysis", path: "/admin-progress", icon: "bi-graph-up" },
    { title: "Leaderboard", path: "/leaderboard", icon: "bi-bar-chart-line" },
    { title: "Reward Store", path: "/admin-reward-store", icon: "bi-shop" },
    { title: "Employees", path: "/admin-employees", icon: "bi-people" },
    
  ];

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      console.log("Fetching all rewards...");
      console.log("Auth headers:", getAuthHeader());
      const data = await rewardsApi.getAllRewards();
      console.log("Fetched rewards:", data);
      setRewards(data || []);
      setError("");
    } catch (err) {
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });
      // Don't show the error message to the user
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModalShow = (reward = null) => {
    if (reward) {
      setEditingReward(reward);
      setFormData({
        name: reward.name,
        description: reward.description,
        pointsCost: reward.pointsCost,
        quantity: reward.quantity,
        imageUrl: reward.imageUrl,
      });
    } else {
      setEditingReward(null);
      setFormData({
        name: "",
        description: "",
        pointsCost: "",
        quantity: "",
        imageUrl: "",
      });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingReward(null);
    setFormData({
      name: "",
      description: "",
      pointsCost: "",
      quantity: "",
      imageUrl: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log the form data being sent
      console.log("Submitting reward data:", formData);

      // Validate form data before submission
      if (!formData.name?.trim()) {
        setError("Name is required");
        return;
      }
      if (!formData.pointsCost || formData.pointsCost < 0) {
        setError("Points cost must be a positive number");
        return;
      }
      if (!formData.quantity || formData.quantity < 0) {
        setError("Quantity must be a positive number");
        return;
      }
      if (!formData.imageUrl?.trim()) {
        setError("Image URL is required");
        return;
      }

      if (editingReward) {
        console.log("Updating reward:", editingReward.id);
        const updatedReward = await rewardsApi.updateReward(
          editingReward.id,
          formData
        );
        console.log("Update response:", updatedReward);
        setSuccess("Reward updated successfully!");
      } else {
        console.log("Creating new reward");
        const newReward = await rewardsApi.createReward(formData);
        console.log("Create response:", newReward);
        setSuccess("Reward created successfully!");
      }
      handleModalClose();
      fetchRewards();
    } catch (err) {
      console.error("Error saving reward:", err);
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save reward. Please try again.";
      setError(errorMessage);
    }
  };

  const handleDelete = async (rewardId) => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      try {
        await rewardsApi.deleteReward(rewardId);
        setSuccess("Reward deleted successfully!");
        fetchRewards();
      } catch (err) {
        setError("Failed to delete reward. Please try again.");
        console.error("Error deleting reward:", err);
      }
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h2>Manage Rewards</h2>
            <Button
              variant="primary"
              onClick={() => handleModalShow()}
              className="mt-2"
            >
              <FaPlus className="me-2" />
              Add New Reward
            </Button>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess("")} dismissible>
            {success}
          </Alert>
        )}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Points Cost</th>
                <th>Quantity</th>
                <th>Image URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id}>
                  <td>{reward.name}</td>
                  <td>{reward.description}</td>
                  <td>{reward.pointsCost}</td>
                  <td>{reward.quantity}</td>
                  <td>
                    <img
                      src={reward.imageUrl}
                      alt={reward.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleModalShow(reward)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(reward.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingReward ? "Edit Reward" : "Add New Reward"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Points Cost</Form.Label>
                <Form.Control
                  type="number"
                  name="pointsCost"
                  value={formData.pointsCost}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingReward ? "Update" : "Create"} Reward
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default AdminRewardStore;

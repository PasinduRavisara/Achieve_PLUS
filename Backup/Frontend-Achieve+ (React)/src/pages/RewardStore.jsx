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
} from "react-bootstrap";
import { FaShoppingCart, FaCoins } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import rewardsApi from "../api/rewards";
import { useAuth } from "../context/AuthContext";
import { getUserAchievementStats } from "../api/achievements";
import "../styles/Rewards.css";
import Navbar from '../components/layout/Navbar';

const RewardStore = () => {
  const { currentUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    fetchRewards();
    fetchUserPoints();
  }, []);

  const fetchRewards = async () => {
    try {
      console.log("Fetching available rewards...");
      const availableRewards = await rewardsApi.getAvailableRewards();
      console.log("Available rewards:", availableRewards);
      if (!availableRewards || availableRewards.length === 0) {
        console.log("No rewards returned from the API");
      }
      setRewards(availableRewards);
      setLoading(false);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error in fetchRewards:", err);
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });
      // Don't set error message to state
      setRewards([]);
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const userId =
        currentUser?.id || JSON.parse(localStorage.getItem("user"))?.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      const stats = await getUserAchievementStats(userId);
      setUserPoints(stats.totalPoints || 0);
      setError(""); 
    } catch (err) {
      console.error("Failed to fetch user points:", err);
      setUserPoints(0);
    }
  };

  const handlePurchaseClick = (reward) => {
    setSelectedReward(reward);
    setShowConfirmModal(true);
    setError(""); 
  };

  const handleConfirmPurchase = async () => {
    try {
      console.log("Attempting to purchase reward:", selectedReward);
      const success = await rewardsApi.purchaseReward(
        selectedReward.id,
        currentUser.id
      );
      if (success) {
        setSuccess("Reward purchased successfully!");
        fetchRewards();
        fetchUserPoints();
      } else {
        setError("Failed to purchase reward. You may not have enough points.");
      }
      setShowConfirmModal(false);
      setSelectedReward(null);
    } catch (err) {
      console.error("Error in handleConfirmPurchase:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to purchase reward. Please try again later.";
      setError(errorMessage);
      setShowConfirmModal(false);
      setSelectedReward(null);
    }
  };

  const employeeSidebarItems = [
    {
      title: "Dashboard",
      path: "/employee-dashboard",
      icon: "bi-speedometer2",
    },
    { title: "My Tasks", path: "/employee-tasks", icon: "bi-list-check" },
    {
      title: "Progress Analysis",
      path: "/progress-analysis",
      icon: "bi-graph-up",
    },
    {
      title: "Rewards & Achievements",
      path: "/employee-rewards",
      icon: "bi-trophy",
    },
    {
      title: "Leaderboard",
      path: "/leaderboard",
      icon: "bi-bar-chart-line",
    },
    { title: "Reward Store", path: "/employee-store", icon: "bi-shop" },
    {
      title: "Wellness Hub",
      path: "/employee-wellness",
      icon: "bi-heart-pulse",
    },
    // {
    //   title: "Profile Settings",
    //   path: "/employee-profile",
    //   icon: "bi-person-gear",
    // },
    // {
    //   title: "Help & Support",
    //   path: "/employee-help",
    //   icon: "bi-question-circle",
    // },
  ];

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

  if (loading) {
    return (
      <DashboardLayout sidebarItems={employeeSidebarItems}>
        <Navbar />
        <div className="d-flex align-items-center justify-content-center min-vh-100 rewards-bg">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={employeeSidebarItems}>
      <div className="min-vh-100 rewards-bg">
        <Navbar />
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <h2 className="reward-store-title">Reward Store</h2>
              <div className="user-points">
                <FaCoins className="points-icon" />
                <span>Your Points: {userPoints}</span>
              </div>
            </Col>
          </Row>

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
          ) : rewards.length === 0 ? (
            <Alert variant="info">
              No rewards available at the moment. Please check back later.
            </Alert>
          ) : (
            <Row>
              {rewards.map((reward) => (
                <Col key={reward.id} md={4} className="mb-4">
                  <Card className="reward-card">
                    <Card.Img
                      variant="top"
                      src={reward.imageUrl}
                      alt={reward.name}
                    />
                    <Card.Body>
                      <Card.Title>{reward.name}</Card.Title>
                      <Card.Text>{reward.description}</Card.Text>
                      <div className="d-flex align-items-center justify-content-between">
                        <Badge bg="primary" className="points-badge">
                          {reward.pointsCost} points
                        </Badge>
                        <Button
                          variant="success"
                          onClick={() => handlePurchaseClick(reward)}
                          disabled={userPoints < reward.pointsCost}
                        >
                          <FaShoppingCart className="me-2" />
                          Purchase
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Purchase Confirmation Modal */}
          <Modal
            show={showConfirmModal}
            onHide={() => setShowConfirmModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Purchase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedReward && (
                <>
                  <p>
                    Are you sure you want to purchase{" "}
                    <strong>{selectedReward.name}</strong>?
                  </p>
                  <p>This will cost you {selectedReward.pointsCost} points.</p>
                  <p>Your current points: {userPoints}</p>
                  <p>
                    Points remaining after purchase:{" "}
                    {userPoints - selectedReward.pointsCost}
                  </p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirmPurchase}>
                Confirm Purchase
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default RewardStore;

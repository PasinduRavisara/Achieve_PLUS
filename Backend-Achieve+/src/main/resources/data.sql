-- Insert sample rewards if they don't exist
INSERT IGNORE INTO reward (name, description, points_cost, quantity, image_url, created_at, updated_at)
VALUES 
('Gift Card - $25', 'Redeemable gift card worth $25 at major retailers', 500, 10, 'https://img.icons8.com/color/96/000000/gift-card.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Extra Vacation Day', 'Get an extra paid vacation day', 1000, 5, 'https://img.icons8.com/color/96/000000/beach.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Premium Coffee Subscription', 'Monthly subscription to premium coffee beans', 800, 3, 'https://img.icons8.com/color/96/000000/coffee.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fitness Tracker', 'Smart fitness tracker with heart rate monitoring', 1500, 2, 'https://img.icons8.com/color/96/000000/smart-watch.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Professional Development Course', 'Access to an online professional development course', 2000, 1, 'https://img.icons8.com/color/96/000000/graduation-cap.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 
-- Insert default plans
INSERT INTO "Plan" (id, title, description, price, listings, featured, "createdAt", "updatedAt") VALUES
('free', 'Free', 'Perfect for new sellers testing the marketplace.', 0, 3, false, NOW(), NOW()),
('pro', 'Pro', 'For growing sellers who need more visibility.', 49, 10, true, NOW(), NOW()),
('premium', 'Premium', 'For agencies and power sellers with unlimited listings.', 129, NULL, false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

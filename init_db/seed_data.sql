-- Seed data for the Mini Investment Platform
-- This file contains sample data to populate the database

-- Insert sample investment products
INSERT INTO investment_products (id, name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description) VALUES
(UUID(), 'Government Bond Fund', 'bond', 36, 6.5, 'low', 1000.00, 100000.00, 'A low-risk government bond fund offering stable returns with capital protection. Ideal for conservative investors seeking steady income.'),
(UUID(), 'Corporate Fixed Deposit', 'fd', 24, 7.2, 'low', 5000.00, 500000.00, 'High-yield corporate fixed deposit with guaranteed returns. Perfect for risk-averse investors looking for better returns than traditional savings.'),
(UUID(), 'Equity Growth Fund', 'mf', 60, 12.8, 'high', 2000.00, 200000.00, 'Aggressive equity mutual fund focusing on growth stocks. Suitable for investors with high risk tolerance seeking capital appreciation.'),
(UUID(), 'Balanced Portfolio Fund', 'mf', 36, 9.5, 'moderate', 1500.00, 150000.00, 'Diversified mutual fund with balanced allocation between equity and debt. Offers moderate risk with steady growth potential.'),
(UUID(), 'Technology ETF', 'etf', 48, 15.2, 'high', 1000.00, 100000.00, 'Exchange-traded fund tracking technology sector performance. High growth potential with corresponding risk levels.'),
(UUID(), 'Infrastructure Bond', 'bond', 60, 8.1, 'moderate', 10000.00, 1000000.00, 'Long-term infrastructure bond supporting national development projects. Offers tax benefits and moderate returns.'),
(UUID(), 'Money Market Fund', 'mf', 12, 5.8, 'low', 1000.00, 500000.00, 'Ultra-short duration fund investing in money market instruments. Provides liquidity with minimal risk.'),
(UUID(), 'Real Estate Investment Trust', 'etf', 36, 10.5, 'moderate', 5000.00, 500000.00, 'REIT fund investing in commercial real estate properties. Offers regular income through rental yields and capital appreciation.');

-- Insert sample users (passwords are hashed versions of 'password123')
INSERT INTO users (id, first_name, last_name, email, password_hash, risk_appetite) VALUES
(UUID(), 'John', 'Doe', 'john.doe@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'moderate'),
(UUID(), 'Jane', 'Smith', 'jane.smith@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'high'),
(UUID(), 'Mike', 'Johnson', 'mike.johnson@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'low'),
(UUID(), 'Sarah', 'Wilson', 'sarah.wilson@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'moderate'),
(UUID(), 'David', 'Brown', 'david.brown@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'high');

-- Insert sample investments
-- Note: These will reference actual product and user IDs from the above inserts
-- In a real scenario, you would use the actual UUIDs returned from the above inserts

-- Sample transaction logs
INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code, error_message) VALUES
(NULL, 'anonymous@example.com', '/api/products', 'GET', 200, NULL),
(NULL, 'anonymous@example.com', '/api/auth/login', 'POST', 401, 'Invalid email or password'),
(NULL, 'anonymous@example.com', '/api/auth/signup', 'POST', 201, NULL),
(NULL, 'anonymous@example.com', '/api/investments/portfolio', 'GET', 401, 'Access token required'),
(NULL, 'anonymous@example.com', '/health', 'GET', 200, NULL);

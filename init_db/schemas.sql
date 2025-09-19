--
-- This SQL script creates the necessary tables for the Mini Investment Platform.
-- It includes DROP TABLE statements to allow for easy recreation of the schema.
-- The script is written for MySQL 8.x and utilizes the UUID() function for primary keys.
--

-- Set the default character set and collation
ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- Drop tables in reverse order to respect foreign key constraints
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `transaction_logs`;
DROP TABLE IF EXISTS `investments`;
DROP TABLE IF EXISTS `investment_products`;
DROP TABLE IF EXISTS `users`;

-- --------------------------------------------------------------------
-- Table structure for `users`
-- Stores user account information
-- --------------------------------------------------------------------
CREATE TABLE `users` (
    `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100),
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `risk_appetite` ENUM('low', 'moderate', 'high') DEFAULT 'moderate',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add an index on the email column for faster lookups
CREATE INDEX `idx_email` ON `users`(`email`);

-- --------------------------------------------------------------------
-- Table structure for `investment_products`
-- Stores information about available investment products
-- --------------------------------------------------------------------
CREATE TABLE `investment_products` (
    `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    `name` VARCHAR(255) NOT NULL,
    `investment_type` ENUM('bond', 'fd', 'mf', 'etf', 'other') NOT NULL,
    `tenure_months` INT NOT NULL,
    `annual_yield` DECIMAL(5,2) NOT NULL,
    `risk_level` ENUM('low', 'moderate', 'high') NOT NULL,
    `min_investment` DECIMAL(12,2) DEFAULT 1000.00,
    `max_investment` DECIMAL(12,2),
    `description` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add an index on name and investment_type for filtering
CREATE INDEX `idx_product_name_type` ON `investment_products`(`name`, `investment_type`);

-- --------------------------------------------------------------------
-- Table structure for `investments`
-- Tracks user investments in products
-- --------------------------------------------------------------------
CREATE TABLE `investments` (
    `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    `user_id` CHAR(36) NOT NULL,
    `product_id` CHAR(36) NOT NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `invested_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('active', 'matured', 'cancelled') DEFAULT 'active',
    `expected_return` DECIMAL(12,2),
    `maturity_date` DATE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `investment_products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add an index on the user_id for faster portfolio lookups
CREATE INDEX `idx_user_id` ON `investments`(`user_id`);

-- --------------------------------------------------------------------
-- Table structure for `transaction_logs`
-- Logs every API call for monitoring and debugging
-- --------------------------------------------------------------------
CREATE TABLE `transaction_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` CHAR(36),
    `email` VARCHAR(255),
    `endpoint` VARCHAR(255) NOT NULL,
    `http_method` ENUM('GET', 'POST', 'PUT', 'DELETE') NOT NULL,
    `status_code` INT NOT NULL,
    `error_message` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for efficient log retrieval by user_id or email
CREATE INDEX `idx_log_user_id` ON `transaction_logs`(`user_id`);
CREATE INDEX `idx_log_email` ON `transaction_logs`(`email`);

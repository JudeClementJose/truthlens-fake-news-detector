-- TruthLens MySQL Database Schema Script
-- Created for MySQL 8.0+

CREATE DATABASE IF NOT EXISTS `truthlens` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `truthlens`;

-- Table structure for users
DROP TABLE IF EXISTS `predictions`;
DROP TABLE IF EXISTS `datasets`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'user',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for predictions
CREATE TABLE `predictions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `headline` TEXT NULL,
  `article` LONGTEXT NOT NULL,
  `prediction` VARCHAR(20) NOT NULL, -- 'Real' or 'Fake'
  `confidence` FLOAT NOT NULL,
  `risk_level` VARCHAR(20) DEFAULT 'Low', -- 'Low', 'Medium', 'High'
  `category` VARCHAR(50) DEFAULT 'General',
  `keywords_json` LONGTEXT NULL,
  `explanation` TEXT NULL,
  `processing_time_ms` FLOAT DEFAULT 0.0,
  `source_type` VARCHAR(20) DEFAULT 'text',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_predictions_user` (`user_id`),
  INDEX `idx_predictions_prediction` (`prediction`),
  INDEX `idx_predictions_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for admins
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(80) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for datasets
CREATE TABLE `datasets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `sample_count` INT DEFAULT 0,
  `uploaded_by` VARCHAR(100) DEFAULT 'Admin',
  `status` VARCHAR(50) DEFAULT 'Uploaded',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin (Password: Admin@12345)
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`) 
VALUES ('System Admin', 'admin@truthlens.ai', 'pbkdf2:sha256:600000$8Z9Yq123$7e65f377508e6f112fb449615a13db3065a397c27632643a137bc6b5952f40c7', 'admin');

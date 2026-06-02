-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS lostfound_db;
USE lostfound_db;

-- 1. Create the users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- BCrypt encrypted hashes
    email VARCHAR(150) NOT NULL UNIQUE,
    role ENUM('CUSTOMER', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER'
);

-- 2. Create the items table
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('LOST', 'FOUND', 'CLAIMED') NOT NULL DEFAULT 'LOST',
    image_path VARCHAR(512), -- stores relative path to file, e.g. "uploads/xyz.jpg"
    reported_by_user_id BIGINT,
    updated_by_user_id BIGINT,
    contact_info VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reported_by FOREIGN KEY (reported_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Explicit SQL DDL commands creating database INDEXES to guarantee high-performance queries
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_reported_by ON items(reported_by_user_id);

const mysql = require('mysql2/promise');
const cache = require('../utils/cache');

// Read database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeoutMillis: 60000,  // How long to wait to acquire a connection (60 seconds)
  connectTimeout: 60000         // Timeout for initial connection (60 seconds)
};

// Create database connection pool
const db = mysql.createPool(dbConfig);

// Test database connection
db.getConnection()
  .then(connection => {
    console.log('Database connection successful');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

module.exports = { db, cache };
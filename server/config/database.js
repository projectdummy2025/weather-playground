const mysql = require('mysql2/promise');

// Read database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'adm4',
  password: process.env.DB_PASSWORD || 'admin0123!',
  database: process.env.DB_NAME || 'adm4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,        // How long to wait to acquire a connection (60 seconds)
  idleTimeout: 60000,           // How long a connection can be idle before being released
  timeout: 60000                // General timeout for operations (60 seconds)
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

module.exports = db;
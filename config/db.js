const fs = require('fs');
const mysql = require('mysql2/promise');

require('dotenv').config();

function buildSslConfig() {
  if (process.env.DB_SSL_CA) {
    return {
      ca: fs.readFileSync(process.env.DB_SSL_CA),
      rejectUnauthorized: true
    };
  }

  if (process.env.DB_SSL === 'true') {
    return {
      rejectUnauthorized: true
    };
  }

  return undefined;
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'geoattend_pro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  ssl: buildSslConfig()
});

pool.getConnection()
  .then(conn => {
    console.log('MySQL connected successfully.');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message);
    console.error('Check your .env DB_* values and that MySQL is running.');
  });

module.exports = pool;
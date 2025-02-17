require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, // No hard-coded secret here
  database: process.env.DB_NAME, 
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((conn) => {
    console.log("✅ Connected to Aiven MySQL successfully!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Aiven MySQL connection failed:", err.message);
  });

module.exports = pool;

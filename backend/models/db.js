const mysql = require('mysql2');
// Thêm dòng này để chắc chắn file db.js cũng đọc được file .env
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 19499,
  ssl: {
    rejectUnauthorized: false // Bắt buộc phải có dòng này để kết nối với đám mây Aiven
  }
});

module.exports = pool.promise();
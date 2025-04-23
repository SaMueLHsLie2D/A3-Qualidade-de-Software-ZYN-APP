const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Password',
  database: 'zyn_app_db',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
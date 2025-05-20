const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Password',
  database: 'zyn_app_db',
});

module.exports = pool.promise();
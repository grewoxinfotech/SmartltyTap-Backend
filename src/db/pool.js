const mysql = require("mysql2/promise");
const { env } = require("../config/env");

const pool = mysql.createPool({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 20,
});

module.exports = { pool };


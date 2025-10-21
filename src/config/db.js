const sql = require('mssql')
require('dotenv').config()

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

let pool

const getConnection = async () => {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}

module.exports = {
  getConnection,
}

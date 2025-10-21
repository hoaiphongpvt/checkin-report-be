const express = require('express')
const app = express()
const route = require('./routes')
const db = require('./config/db')

// Connect to database
db.getConnection()
  .then(() => {
    console.log('✅ Database connected successfully')
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error)
  })

route(app)

module.exports = app

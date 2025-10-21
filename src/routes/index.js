const siteRouter = require('./site')
const timekeepingRouter = require('./timekeeping')

function route(app) {
  app.use('/', siteRouter)
  app.use('/', timekeepingRouter)
}

module.exports = route

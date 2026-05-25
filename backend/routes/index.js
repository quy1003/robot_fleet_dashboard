const RobotRoutes = require('./robots')
const { ROUTES } = require('../constants/routes')

module.exports = (app) => {
  new RobotRoutes(app, ROUTES.API.ROBOTS)
}

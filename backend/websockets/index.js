const RobotWebSocket = require('./robots')
const DashboardWebSocket = require('./dashboard')
const { ROUTES } = require('../constants/routes')
const { REDIS_CHANNELS } = require('../constants/events')
const { subClient, connectRedis } = require('./redis')

module.exports = (app) => {
  // Initialize state at the root of websockets, shared between both channels
  const dashboardClients = new Set()

  // Connect to Redis and listen for events
  connectRedis().then(() => {
    subClient.subscribe(REDIS_CHANNELS.TELEMETRY_UPDATE, (message) => {
      // When Redis have message dispatch this message to dashboard client
      for (const client of dashboardClients) {
        client.send(message)
      }
    })
  })

  new RobotWebSocket(app, ROUTES.WS.ROBOTS, dashboardClients)
  new DashboardWebSocket(app, ROUTES.WS.DASHBOARD, dashboardClients)
}

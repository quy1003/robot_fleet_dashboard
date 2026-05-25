const RobotWebSocket = require('./robots')
const DashboardWebSocket = require('./dashboard')
const { ROUTES } = require('../constants/routes')
const { REDIS_CHANNELS } = require('../constants/events')
const { subClient, connectRedis } = require('./redis')

module.exports = (app) => {
  // Khởi tạo state ngay tại root của websockets, dùng chung cho cả 2 channel
  const dashboardClients = new Set()

  // Kết nối Redis và lắng nghe sự kiện
  connectRedis().then(() => {
    subClient.subscribe(REDIS_CHANNELS.TELEMETRY_UPDATE, (message) => {
      // Khi có tin nhắn từ Redis, phát lại cho các Dashboard đang kết nối với Worker này
      for (const client of dashboardClients) {
        client.send(message)
      }
    })
  })

  new RobotWebSocket(app, ROUTES.WS.ROBOTS, dashboardClients)
  new DashboardWebSocket(app, ROUTES.WS.DASHBOARD, dashboardClients)
}

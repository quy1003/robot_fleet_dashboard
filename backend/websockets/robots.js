const qs = require('node:querystring')
const { validateTelemetry } = require('../validators/telemetry')
const { models } = require('../database/index.js')
const { pubClient } = require('./redis')
const { REDIS_CHANNELS } = require('../constants/events')

// Create a buffer to store data temporarily
const telemetryBuffer = []

// Save data every 5s
setInterval(async () => {
  if (telemetryBuffer.length > 0) {
    const dataToSave = telemetryBuffer.splice(0, telemetryBuffer.length)
    
    try {
      await models.RobotTelemetry.insertMany(dataToSave)
    } catch (err) {
      console.error('Error when saving data batch:', err.message)
    }
  }
}, 5000)

class RobotWebSocket {
  constructor(app, prefix, dashboardClients) {
    this.app = app
    this.prefix = prefix
    this.dashboardClients = dashboardClients
    this.register()
  }

  register() {
    this.app.ws(this.prefix, {
      upgrade: this.onUpgrade.bind(this),
      open: this.onOpen.bind(this),
      message: this.onMessage.bind(this),
      close: this.onClose.bind(this),
    })
  }

  onUpgrade(res, req, context) {
    const secWebSocketKey = req.getHeader('sec-websocket-key')
    const secWebSocketProtocol = req.getHeader('sec-websocket-protocol')
    const secWebSocketExtensions = req.getHeader('sec-websocket-extensions')
    const query = qs.parse(req.getQuery()) || {}

    res.upgrade(
      { robotId: query.robotId },
      secWebSocketKey,
      secWebSocketProtocol,
      secWebSocketExtensions,
      context
    )
  }

  onOpen(ws) {
    console.log(`Robot ${ws.robotId} connected`)
  }

  async onMessage(ws, message) {
    try {
      const data = JSON.parse(Buffer.from(message).toString())

      const { valid, error } = validateTelemetry(data)
      if (!valid) {
        console.warn(`Invalid data from ${ws.robotId}: ${error}`)
        return
      }

      const telemetry = {
        ...data,
        robotId: ws.robotId,
        timestamp: new Date(data.timestamp),
      }

      // Add data to bucket instead of insert to DB directly
      telemetryBuffer.push(telemetry)

      const payload = JSON.stringify({ type: 'telemetry', data: telemetry })
      
      // Publish data to Publisher
      if (pubClient.isOpen) {
        pubClient.publish(REDIS_CHANNELS.TELEMETRY_UPDATE, payload)
      } else {
        // Fallback send directly if Redis lost connection
        for (const client of this.dashboardClients) {
          client.send(payload)
        }
      }
    } catch (error) {
      console.error('Error processing robot message:', error)
    }
  }

  onClose(ws) {
    console.log(`Robot ${ws.robotId} disconnected`)
  }
}

module.exports = RobotWebSocket

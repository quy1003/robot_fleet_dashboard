class DashboardWebSocket {
  constructor(app, prefix, dashboardClients) {
    this.app = app
    this.prefix = prefix
    this.dashboardClients = dashboardClients
    this.register()
  }

  register() {
    this.app.ws(this.prefix, {
      open: this.onOpen.bind(this),
      message: this.onMessage.bind(this),
      close: this.onClose.bind(this),
    })
  }

  onOpen(ws) {
    this.dashboardClients.add(ws)
    console.log(`Dashboard client connected. Total: ${this.dashboardClients.size}`)
  }

  onMessage(ws, message) {
    try {
      const data = JSON.parse(Buffer.from(message).toString())
      console.log('Dashboard message:', data)
    } catch (error) {
      console.error('Error processing dashboard message:', error)
    }
  }

  onClose(ws) {
    this.dashboardClients.delete(ws)
    console.log(`Dashboard client disconnected. Total: ${this.dashboardClients.size}`)
  }
}

module.exports = DashboardWebSocket

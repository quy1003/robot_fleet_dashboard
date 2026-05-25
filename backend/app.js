require('dotenv').config()

const { App } = require('uWebSockets.js')
const { connectDB } = require('./database/index.js')
const setupWebSockets = require('./websockets')
const setupRoutes = require('./routes')

const PORT = process.env.PORT || 8080

const app = App({
  maxCompressedSize: 64 * 1024,
  maxBackpressure: 64 * 1024,
})

setupWebSockets(app)
setupRoutes(app)

app.listen(PORT, (token) => {
  if (token) {
    console.log(`🚀 Robot Fleet Server listening on port ${PORT}`)
  } else {
    console.log('❌ Failed to listen on port', PORT)
    process.exit(1)
  }
})

connectDB().catch(console.error)

process.on('SIGINT', () => {
  console.log('\n📛 Shutting down server...')
  process.exit(0)
})

module.exports = app

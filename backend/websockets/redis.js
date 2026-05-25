const { createClient } = require('redis')

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

const pubClient = createClient({ url: REDIS_URL })
const subClient = pubClient.duplicate()

pubClient.on('error', (err) => console.error('Redis Pub Client Error:', err.message))
subClient.on('error', (err) => console.error('Redis Sub Client Error:', err.message))

async function connectRedis() {
  try {
    await pubClient.connect()
    await subClient.connect()
    console.log('✅ Connected to Redis Pub/Sub')
  } catch (err) {
    console.error('❌ Failed to connect to Redis. Make sure Redis server is running.', err.message)
  }
}

module.exports = { pubClient, subClient, connectRedis }

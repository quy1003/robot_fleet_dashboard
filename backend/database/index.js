const mongoose = require('mongoose')
const RobotTelemetry = require('./models/RobotTelemetry')

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/robot-fleet'
    )
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

module.exports = { connectDB, models: { RobotTelemetry } }

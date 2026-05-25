const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  robotId:            { type: String, required: true },
  batteryPercentage:  { type: Number, required: true },
  wifiSignalStrength: { type: Number, required: true },
  isCharging:         { type: Boolean, required: true },
  temperature:        { type: Number, required: true },
  memoryUsage:        { type: Number, required: true },
  timestamp:          { type: Date, required: true },
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'robotId',
    granularity: 'seconds'
  },
  expireAfterSeconds: 604800 // Delete old data after 7 days (replaces old TTL index)
});

// Note: Manual indexes were removed because Time-Series automatically creates 
// optimal indexes for timeField and metaField.

module.exports = mongoose.model('RobotTelemetry', schema);
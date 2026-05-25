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
  expireAfterSeconds: 604800 // Xóa dữ liệu cũ sau 7 ngày (thay thế cho TTL index cũ)
});

// Chú ý: Các index thủ công đã được xóa vì Time-Series tự động tạo index 
// tối ưu nhất cho timeField và metaField.

module.exports = mongoose.model('RobotTelemetry', schema);
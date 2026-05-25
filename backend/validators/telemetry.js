const REQUIRED_FIELDS = [
  'batteryPercentage', 'wifiSignalStrength',
  'isCharging', 'temperature', 'memoryUsage', 'timestamp'
];

function validateTelemetry(data) {
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null)
      return { valid: false, error: `Missing field: ${field}` };
  }
  if (data.batteryPercentage < 0 || data.batteryPercentage > 100)
    return { valid: false, error: 'batteryPercentage out of range' };
  if (data.wifiSignalStrength < -100 || data.wifiSignalStrength > 0)
    return { valid: false, error: 'wifiSignalStrength out of range' };
  return { valid: true };
}

module.exports = { validateTelemetry };
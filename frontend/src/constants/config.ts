export const APP_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/dashboard',
  THRESHOLDS: {
    LOW_BATTERY: 20,
    CRITICAL_TEMP: 80,
  },
  CHART: {
    MAX_DATA_POINTS: 20,
    ANIMATION_DURATION: 300,
    MAX_DETAIL_CHART_POINTS: 120, // Maximum data points rendered on detail chart (Downsample)
  },
  ALERTS: {
    MAX_HISTORY: 50,
  },
  HISTORY: {
    HOURS: 6, // Default number of hours for historical data
  }
};

export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const ROBOT_STATUS = {
  ONLINE: 'online',
  WARNING: 'warning',
  OFFLINE: 'offline',
} as const;

export const WS_EVENTS = {
  TELEMETRY: 'telemetry',
  ROBOT_UPDATE: 'robot_update',
  ROBOT_CONNECTED: 'robot_connected',
  ROBOT_DISCONNECTED: 'robot_disconnected',
  INITIAL_ROBOTS: 'initial_robots',
} as const;

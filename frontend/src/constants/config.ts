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
    MAX_DETAIL_CHART_POINTS: 120, // Số điểm tối đa vẽ trên biểu đồ chi tiết (Downsample)
  },
  ALERTS: {
    MAX_HISTORY: 50,
  },
  HISTORY: {
    HOURS: 6, // Số giờ tải dữ liệu lịch sử mặc định
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

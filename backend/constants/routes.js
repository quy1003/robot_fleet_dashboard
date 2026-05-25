const API_VERSION = '/api/v1' // Thay đổi version ở đây nếu nâng cấp API

const ROUTES = {
  API: {
    BASE: API_VERSION,
    ROBOTS: `${API_VERSION}/robots`,
  },
  WS: {
    BASE: '/ws',
    ROBOTS: '/ws/robots',
    DASHBOARD: '/ws/dashboard',
  },
}

module.exports = {
  API_VERSION,
  ROUTES,
}

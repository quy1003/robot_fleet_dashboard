const API_VERSION = '/api/v1' // Change version here if upgrading API

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

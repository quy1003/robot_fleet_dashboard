const { models } = require('../database/index.js')
const { sendSuccess } = require('../utils/response')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')

class RobotRoutes {
  constructor(app, prefix) {
    this.app = app
    this.prefix = prefix
    this.registerRoutes()
  }

  registerRoutes() {
    // Wrap bằng asyncHandler để tự động bắt lỗi
    this.app.get(`${this.prefix}/:id/history`, asyncHandler(this.getHistory.bind(this)))
    this.app.get(`${this.prefix}`, asyncHandler(this.getLatestSnapshot.bind(this)))
  }

  async getHistory(res, req) {
    const robotId = req.getParameter(0)
    const hours = parseInt(req.getQuery('hours') || '6')
    const since = new Date(Date.now() - hours * 3600 * 1000)

    // Lấy dữ liệu
    const history = await models.RobotTelemetry.find(
      { robotId, timestamp: { $gte: since } },
      { _id: 0, __v: 0 }
    )
      .sort({ timestamp: 1 })
      .lean()

    // Ví dụ về việc throw error (Bạn có thể xoá nêú không cần):
    if (!history) {
      throw new AppError('Không tìm thấy lịch sử cho robot này', 404)
    }

    sendSuccess(res, history)
  }

  async getLatestSnapshot(res, req) {
    const latest = await models.RobotTelemetry.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: '$robotId', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
    ])

    sendSuccess(res, latest)
  }
}

module.exports = RobotRoutes

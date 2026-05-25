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
    // Wrap with asyncHandler for automatic error handling
    this.app.get(`${this.prefix}/:id/history`, asyncHandler(this.getHistory.bind(this)))
    this.app.get(`${this.prefix}`, asyncHandler(this.getLatestSnapshot.bind(this)))
  }

  async getHistory(res, req) {
    const robotId = req.getParameter(0)
    const hours = parseInt(req.getQuery('hours') || '6')
    const since = new Date(Date.now() - hours * 3600 * 1000)

    // Fetch data
    const history = await models.RobotTelemetry.find(
      { robotId, timestamp: { $gte: since } },
      { _id: 0, __v: 0 }
    )
      .sort({ timestamp: 1 })
      .lean()

    // Example of throwing an error (You can remove if not needed):
    if (!history) {
      throw new AppError('History not found for this robot', 404)
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

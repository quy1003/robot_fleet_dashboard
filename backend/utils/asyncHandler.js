const { sendError } = require('./response')

const asyncHandler = (handler) => {
  return async (res, req) => {
    let isAborted = false
    res.onAborted(() => {
      isAborted = true
      res.aborted = true
    })

    try {
      await handler(res, req)
    } catch (error) {
      if (!isAborted) {
        const statusCode = error.statusCode || 500
        const message = error.message || 'Internal Server Error'
        sendError(res, message, statusCode)
      }
    }
  }
}

module.exports = asyncHandler

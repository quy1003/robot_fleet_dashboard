const sendSuccess = (res, data = null, status = 200) => {
  if (res.aborted) return

  res.cork(() => {
    res
      .writeStatus(status.toString())
      .writeHeader('Content-Type', 'application/json')
      .writeHeader('Access-Control-Allow-Origin', '*')
      .end(
        JSON.stringify({
          status: 'success',
          data,
          timestamp: new Date().toISOString(),
        })
      )
  })
}

const sendError = (res, message, status = 500) => {
  if (res.aborted) return

  res.cork(() => {
    res
      .writeStatus(status.toString())
      .writeHeader('Content-Type', 'application/json')
      .writeHeader('Access-Control-Allow-Origin', '*')
      .end(
        JSON.stringify({
          status: 'error',
          message,
          timestamp: new Date().toISOString(),
        })
      )
  })
}

module.exports = {
  sendSuccess,
  sendError,
}

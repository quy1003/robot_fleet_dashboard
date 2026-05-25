const cluster = require('node:cluster')
const os = require('node:os')
const process = require('node:process')

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length
  console.log(`Primary ${process.pid} is running`)
  console.log(`Forking ${numCPUs} workers...`)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code}. Restarting...`)
    cluster.fork()
  })
} else {
  // Worker process
  require('./app.js')
}

const os = require('os')

function HealthCheck () {
  return new Promise(function (resolve, reject) {
    let status = {
      online: true,
      hostname: os.hostname(),
      uptime: os.uptime()
    }
    console.log(status)
    resolve(status)
  })
}

module.exports = {
  HealthCheck
}

const http = require('http')
const WebSocketServer = require('uws').Server
const wss = new WebSocketServer({port: 3000})

healthCheck().then(function (result) {
  console.log('Online: ' + result.online + ' hostname: ' + result.hostname)
  if (result.online === true && result.hostname != null) {
    console.log('Attempting to create websocket')
    http.get('http://localhost:3001/connect', function (res) {
      console.log(res)
    })
  }
})

function healthCheck () {
  let data = ''
  return new Promise(function (resolve, reject) {
    http.get('http://localhost:3001/healthcheck', function (res) {
      res.on('data', function (chunk) {
        data += chunk
      })
      res.on('end', function () {
        resolve(JSON.parse(data))
      })
    }).on('error', function (err) {
      console.log('Error: ' + err)
      reject(new Error('Error: ' + err))
    })
  })
}

function onMessage (message) {
  console.log('Recieved: ' + message)
  this.send(message + ' : ' + Date.now)
}

wss.on('connection', function (ws) {
  ws.on('message', onMessage)
})

wss.on('error', function error () {
  console.log('Cannot start server')
})

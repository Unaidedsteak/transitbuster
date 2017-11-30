const WebSocket = require('uws')
const express = require('express')
const os = require('os')
const checks = require('./utils/checks')
const app = express()

// Return status of satelite if running, used to confirm functional
app.get('/healthcheck', function (req, res) {
  checks.HealthCheck().then(function (result) {
    res.status(200).send(result)
  })
})

// Connect to websocket on request
app.get('/connect', function (req, res) {
  console.log('Connection request received!')
  connectSocket(req.connection.remoteAddress.replace(/^.*:/, ''))
})

app.listen(3001, () => console.log('Transit Satelite is running on port: 3001'))

function connectSocket (remoteAddr) {
  console.log('Remote Address: ' + remoteAddr)
  if (remoteAddr) {
    let url = 'ws://' + remoteAddr + ':3000'
    let websocket = new WebSocket(url)
    websocket.on('open', function open () {
      console.log('Websocket connected!')
      websocket.send(os.hostname() + ' connected!')
    })

    websocket.on('message', onMessage)

    websocket.on('error', function error () {
      console.log('Error connecting!')
    })
  } else {
    console.log('Invalid remote address, websocket connection failed!')
    return null
  }
}

function onMessage (message) {
  console.log('Recieved: ' + message)
  this.send(message)
}

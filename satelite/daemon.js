const WebSocket = require('uws').Server
const traceroute = require('traceroute')

var wss = new WebSocket({
  'port': 3001
})

wss.on('connection', function (ws) {
  ws.on('message', message)
  function message (message) {
    if (message === 'healthcheck') {
      console.log(message)
      ws.send('OK')
    } else if (message === 'traceroute') {
      console.log(message)
      traceroute.trace(message, function (err, hops) {
        if (!err) ws.send(hops)
      })
    } else {
      console.log('Invalid message', message)
      ws.send('BROKEN')
    }
  }
})

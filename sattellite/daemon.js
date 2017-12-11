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
      ipValidate(message).then(function (address) {
        traceroute.trace(address, function (err, hops) {
          if (!err) ws.send(hops)
        })
      })
    } else {
      console.log('Invalid message', message)
      ws.send('BROKEN')
    }
  }
})

function ipValidate (message) {
  return new Promise(function (resolve, reject) {
    let data = message.split(':', 2)
    let ip = data[data.length - 1]
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
      resolve(ip)
    } else {
      reject('Invalid IP address', ip)
    }
  })
}

ipValidate('traceroute:192.168.1.1').then(function (data) {
  console.log('IP validation returned:', data)
})

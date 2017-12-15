const WebSocket = require('uws').Server
const traceroute = require('traceroute')

var wss = new WebSocket({
  'port': 3001
})

wss.on('connection', function (ws) {
  ws.on('message', message)
  function message (message) {
    /* Determine command given */
    messageValidate(message).then(function (command) {
      console.log('Recieved command:', command)
      if (command === 'traceroute') {
        ipValidate(message).then(function (address) {
          traceroute.trace(address, function (err, hops) {
            console.log('Hops:', hops)
            if (!err) ws.send(hops)
          })
        })
      } else {
        if (message === 'healthcheck') {
          console.log(message)
          ws.send('OK')
        } else {
          console.log('Invalid message', message)
          ws.send('BROKEN')
        }
      }
    })
  }
})

function ipValidate (message) {
  return new Promise(function (resolve, reject) {
    let data = message.split(':', 2)
    let ip = data[data.length - 1]
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
      resolve(ip)
    } else {
      reject(new Error('Invalid IP address', ip))
    }
  })
}

function messageValidate (message) {
  return new Promise(function (resolve, reject) {
    if (message.includes('traceroute')) {
      console.log('this message contains traceroute', message)
      resolve('traceroute')
    } else {
      console.log('Not a traceroute')
      reject(new Error('invalid command'))
    }
  })
}

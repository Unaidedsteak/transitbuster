const WebSocket = require('uws').Server
const ping = require('net-ping')

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
          for (let ttl = 1; ttl < 128; ttl ++){
            trace(address, ttl).then(function (hop) {
              ws.send(JSON.stringify(hop))
            })
          }
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
      reject('Invalid IP address', ip)
    }
  })
}

function messageValidate (message) {
  return new Promise(function (resolve, reject) {
    if (message.includes("traceroute")) {
      console.log('this message contains traceroute', message)
      resolve('traceroute')
    } else {
      console.log('Not a traceroute')
      reject('invalid command')
    }
  })
}

function trace (address, ttl) {
  return new Promise(function(resolve, reject) {
    let session = ping.createSession({
      retries: 1,
      timeout: 2000
    })

    session.traceRoute(address, ttl, feedback, done)

    function feedback(error, target, ttl, sent, rcvd) {
      let response = {"err": error, "target": target, "ttl": ttl, "sent": sent, "rcvd": rcvd}
      resolve(response)
    }

    function done(error, target) {
      let response = {"err": error, "target": target}
      resolve(response)
    }
  })
}

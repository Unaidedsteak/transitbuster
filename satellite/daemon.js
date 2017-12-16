const dns = require('dns')
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
            trace(address, ttl, command).then(function (hop) {
              ws.send(JSON.stringify(hop))
            })
          }
        })
      } else {
        if (command === 'initialize') {
          ipValidate(message).then(function (address) {
            for (let ttl = 1; ttl < 128; ttl ++){
              trace(address, ttl, command).then(function (hop) {
                ws.send(JSON.stringify(hop))
              })
            }
          })
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
      dns.lookup(ip, (err, addr, fam) => {
        if (err) {
          reject('DNS Lookup failed')
        } else {
          resolve(addr)
        }
      })
    }
  })
}

function messageValidate (message) {
  return new Promise(function (resolve, reject) {
    if (message.includes("traceroute")) {
      console.log('Traceroute recieved', message)
      resolve('traceroute')
    } else if (message.includes("initialization")) {
      console.log('Initialzing hops')
      resolve('initialize')
    } else {  
      reject('invalid command')
    }
  })
}

function trace (address, ttl, state) {
  return new Promise(function(resolve, reject) {
    let session = ping.createSession({
      retries: 1,
      timeout: 2000
    })

    session.traceRoute(address, ttl, feedback, done)

    function feedback(error, target, ttl, sent, rcvd) {
      let response = {"err": error, "target": target, "ttl": ttl, "sent": sent, "rcvd": rcvd}
      if (state === 'traceroute') {
        resolve(response)
      } 
    }

    function done(error, target) {
      let response = {"err": error, "target": target}
      if (state === 'initialize') {
        resolve(response)
      } else if (state === 'initialize') {
        resolve('hops:', response)
      }
    }
  })
}

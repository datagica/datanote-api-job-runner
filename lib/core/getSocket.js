const WebSocket = require('rpc-websockets').Client

let promiseFulfilled = false
let socketPromise

async function getSocket (config) {

  if (!socketPromise) {

    socketPromise = new Promise(function initWebSocket(resolve, reject) {

      console.log("connecting to the master server..")

      const rawSocket = new WebSocket(config.url, config.socket)

      // worker api
      rawSocket.worker = function (job) {
        return rawSocket.call('worker', {
          version: config.version,
          login: config.login,
          token: config.token,
          job: job
        }, config.timeout)
      }

      rawSocket.on('open', function() {
        if (!promiseFulfilled) {
          promiseFulfilled = true
          console.log(`connected to ${config.url}`)
          resolve(rawSocket)
        }
      })

      rawSocket.on('error', function(err) {
        // we always log the error but only reject the promise once
        if (promiseFulfilled) {
          console.error("[getSocket] connection error: " + err.message)
        } else {
          promiseFulfilled = false
          reject(new Error(err.message))
        }
      })
    })
  }

  return socketPromise
}

module.exports = getSocket

const program = require('commander')
const main = require('./index')

program
  .version('0.0.0')
  .option('-p, --preload', 'preload the data', false)
  .option('-d, --debug', 'debug mode', false)
  .option('-l, --login [login]', 'login', 'desktop')
  .option('-k, --token [token]', 'token', 'e85151ee9dd9e95d06067c8d5a2571f2605b9b1c')
  .option('-u, --url [url]', 'url', 'ws://localhost:8979')
  .option('-t, --timeout [timeout]', 'timeout', parseInt, 30000)
  .option('-m, --maxErrors [maxErrors]', 'max errors', parseInt, 20)
  .parse(process.argv)

main({
  version: 1,
  debug: program.debug,
  preload: program.preload,
  login: program.login,
  token: program.token,
  url: program.url,
  socket: {
    autoconnect: true,
    reconnect: true,
    reconnect_interval: 15000,
    max_reconnects: 100
  },
  timeout: program.timeout,
  maxErrors: program.maxErrors
})
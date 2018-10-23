'use strict'
const config = require('./config.json')
const worker = require('./core/worker')
const error = require('./utils/error')
const { modules } = require('@datagica/datanote-api-engine')


setTimeout(() => {
  if (config.preload) {
    console.log(`pre-loading locations..`)
    modules.location("").then(ready => worker(config))
  } else {
    worker(config)
  }
}, 2000)

module.exports = async (req, res) => {
  error(res, 403, `Sorry, nothing to see here.`)
}

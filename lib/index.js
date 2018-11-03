'use strict'

const worker = require('./core/worker')
const { modules } = require('@datagica/datanote-api-engine')

// init function to preload heavy parts of the extraction engine,
// such as the location database (can take between 30 and 60 seconds to load)
let preloaded = false
async function preload () {
  if (!preloaded) {
    console.log(`preloading recognition engine..`)
    try {
      await modules.location("")
      console.log(`recognition engine successfully loaded`)
      preload = true
    } catch (exc) {
      console.error(`failed to load recognition engine`)
    }
  } else {
    console.log('warning: recognition engine is already loaded')
  }
}

// create an instance of API, loading the data and booting up the
// async worker before
async function main (config) {
  if (config.preload) {
    await preload()
  }
  await worker(config)
}

module.exports = main
module.exports.default = main

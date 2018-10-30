'use strict'

const config = require('./config.json')
const api = require('./api')
module.exports = api(config)
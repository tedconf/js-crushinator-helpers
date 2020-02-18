
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./crushinator.cjs.production.min.js')
} else {
  module.exports = require('./crushinator.cjs.development.js')
}

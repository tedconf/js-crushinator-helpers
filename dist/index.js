
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./ted-crushinator-helpers.cjs.production.min.js')
} else {
  module.exports = require('./ted-crushinator-helpers.cjs.development.js')
}

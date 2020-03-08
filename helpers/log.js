// Module imports
const Logger = require('ians-logger').createLoggerFromName('fdgt')





const log = (message, meta = {}, type = 'log') => {
  Logger[type](message)

  Object.entries(meta).forEach(([key, value]) => {
    console.log(`> ${key}:`, value)
  })

  console.log('')
}





module.exports = log

// Module imports
const Logger = require('ians-logger').createLoggerFromName('fdgt')





module.exports = (message, meta = {}, type = 'log') => {
	Logger[type](message)

	Object.entries(meta).forEach(([key, value]) => {
		console.log(`> ${key}:`, value)
	})
}

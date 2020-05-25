// Module imports
const Logger = require('ians-logger').createLoggerFromName('fdgt')





// Local constants
const { DEBUG } = process.env





module.exports = (message, meta = {}, type = 'log') => {
	if (DEBUG) {
		Logger[type](message)

		Object.entries(meta).forEach(([key, value]) => {
			console.log(`> ${key}:`, value)
		})
	}
}

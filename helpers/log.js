// Module imports
import Logger from 'ians-logger'





// Local constants
const { DEBUG } = process.env
const logger = Logger.createLoggerFromName('fdgt')





module.exports = (message, meta = {}, type = 'log') => {
	if (DEBUG) {
		logger[type](message)

		Object.entries(meta).forEach(([key, value]) => {
			console.log(`> ${key}:`, value)
		})
	}
}

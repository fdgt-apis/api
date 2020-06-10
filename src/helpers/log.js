// Module imports
import Logger from 'ians-logger'





// Local imports
import {
	firebaseAdmin,
	firestore,
} from '../helpers/firebase'





// Local constants
const {
	DEBUG,
	NODE_ENV,
} = process.env
const logger = Logger.createLoggerFromName('@fdgt/api')
const logsCollection = firestore.collection('logs')





module.exports = (message, meta = {}, type = 'log') => {
	logsCollection.add({
		createdAt: firebaseAdmin.firestore.Timestamp.now(),
		message,
		meta,
		type,
	})

	if (DEBUG) {
		logger[type](message)

		Object.entries(meta).forEach(([key, value]) => {
			console.log(`> ${key}:`, value)
		})
	}
}

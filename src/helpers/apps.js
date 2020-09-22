// Local imports
import { firestore } from 'helpers/firebase'





// Local constants
const { NODE_ENV } = process.env





async function fixUnlabeledLogs (appID, connectionID) {
	const logsCollection = firestore.collection('logs')
	const now = new Date
	const unlabeledLogIDs = []

	const logsSnapshot = await logsCollection
		.where('connectionID', '==', connectionID)
		.where('createdAt', '<', now)
		.get()

	logsSnapshot.forEach(doc => unlabeledLogIDs.push(doc.id))

	try {
		await Promise.all(unlabeledLogIDs.map(logID => {
			return logsCollection.doc(logID).update({ appID })
		}))
	} catch (error) {
		console.log(error)
	}
}

export async function getApp (appID, connectionID) {
	if ((NODE_ENV !== 'test') && appID) {
		try {
			const app = await firestore.collection('apps').doc(appID).get()

			if (app) {
				return {
					id: app.id,
					...app.data(),
				}

				fixUnlabeledLogs(appID, connectionID)
			}

			return null
		} catch (error) {
			console.log(error)
		}
	}
}

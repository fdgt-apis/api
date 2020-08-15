// Local imports
import {
	firebaseAdmin,
	firestore,
} from 'helpers/firebase'





export default async (message, connection) => {
	const [token] = message.params
	const appID = token.replace(/^oauth:/, '')

	const app = (await firestore.collection('apps').doc(appID).get()).data()

	if (app) {
		firestore.collection('appConnections').add({
			appID,
			connectionID: connection.id,
		})
	}

	connection.token = token
	connection.emit('acknowledge')
}

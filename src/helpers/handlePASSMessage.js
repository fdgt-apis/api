// Local imports
import {
	firebaseAdmin,
	firestore,
} from 'helpers/firebase'





export default async (message, connection) => {
	const [token] = message.params

	connection.token = token
	connection.emit('acknowledge')
}

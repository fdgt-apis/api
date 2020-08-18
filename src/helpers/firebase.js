require('dotenv').config()

// Module imports
import * as firebaseAdmin from 'firebase-admin'





// Local constants
const {
	FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
	FIREBASE_AUTH_URI,
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_CLIENT_ID,
	FIREBASE_CLIENT_X509_CERT_URL,
	FIREBASE_PRIVATE_KEY_ID,
	FIREBASE_PRIVATE_KEY,
	FIREBASE_PROJECT_ID,
	FIREBASE_TOKEN_URI,
	FIREBASE_TYPE,
	FIREBASE_DATABASE_URL,
	NODE_ENV,
} = process.env





// Local variables
let app = null





if (NODE_ENV !== 'test') {
	app = firebaseAdmin.apps[0] || firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert({
			auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
			auth_uri: FIREBASE_AUTH_URI,
			client_email: FIREBASE_CLIENT_EMAIL,
			client_id: FIREBASE_CLIENT_ID,
			client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
			private_key_id: FIREBASE_PRIVATE_KEY_ID,
			private_key: FIREBASE_PRIVATE_KEY,
			project_id: FIREBASE_PROJECT_ID,
			token_uri: FIREBASE_TOKEN_URI,
			type: FIREBASE_TYPE,
		}),
		databaseURL: FIREBASE_DATABASE_URL,
	})
}





export const firebase = app
export const firestore = app?.firestore()
export const database = app?.database()
export { firebaseAdmin }

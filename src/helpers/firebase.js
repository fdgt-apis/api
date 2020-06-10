require('dotenv').config()

// Module imports
import * as firebaseAdmin from 'firebase-admin'





// Local variable
let app = null





if (!app) {
  app = firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert({
			auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
			auth_uri: process.env.FIREBASE_AUTH_URI,
			client_email: process.env.FIREBASE_CLIENT_EMAIL,
			client_id: process.env.FIREBASE_CLIENT_ID,
			client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
			private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
			private_key: process.env.FIREBASE_PRIVATE_KEY,
			project_id: process.env.FIREBASE_PROJECT_ID,
			token_uri: process.env.FIREBASE_TOKEN_URI,
			type: process.env.FIREBASE_TYPE,
		}),
		databaseURL: 'https://fdgt-1172f.firebaseio.com',
	})
}





export const firebase = app
export const firestore = app.firestore()
export { firebaseAdmin }

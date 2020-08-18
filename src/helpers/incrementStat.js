// Local imports
import { database } from 'helpers/firebase'





module.exports = (counterName, increment = 1) => {
	try {
		database.ref(`stats/${counterName}`).transaction(function (currentCount) {
			return currentCount + parseInt(increment, 10)
		})
	} catch (error) {
		console.log(`Failed to increment stat: ${counterName}`, error)
	}
}

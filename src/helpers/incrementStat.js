// Local imports
import { database } from 'helpers/firebase'





module.exports = (counterName, increment = 1) => {
	database.ref(`stats/${counterName}`).transaction(function (currentCount) {
		return currentCount + parseInt(increment, 10)
	})
}

// Local imports
import { database } from 'helpers/firebase'





// Local constants
const { NODE_ENV } = process.env





const updateStat = (counterName, increment = 1) => {
	if (NODE_ENV !== 'test') {
		try {
			database.ref(`stats/${counterName}`).transaction(function (currentCount) {
				return currentCount + parseInt(increment, 10)
			})
		} catch (error) {
			console.log(`Failed to update stat: ${counterName}`, error)
		}
	}
}

export const decrementStat = (counterName, increment = 1) => updateStat(counterName, increment * -1)

export const incrementStat = (counterName, increment = 1) => updateStat(counterName, increment)

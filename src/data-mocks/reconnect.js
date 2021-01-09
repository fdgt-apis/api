// Module imports
import faker from 'faker'





// Local imports
import { incrementStat } from 'helpers/updateStat'





// Local constants
const { HOST } = process.env






/**
 * `reconnect` events are fired when a connection is requested to reconnect
 *
 * @alias `reconnect`
 *
 * @example @lang off <caption>Fires a `reconnect` event</caption>
 * reconnect
 */
export const render = (args = {}) => {
	incrementStat('events/reconnect')

	return {
		message: `${HOST} RECONNECT`,
	}
}

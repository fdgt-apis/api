// Module imports
import { v4 as uuid } from 'uuid'
import tinycolor from 'tinycolor2'





// Local imports
import renderMessage from 'helpers/renderMessage'





// Local constants
const { HOST } = process.env





export default class {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	color = tinycolor.random().toHexString()

	id = uuid()





	/***************************************************************************\
		Public Methods
	\***************************************************************************/

	constructor (options) {
		this.options = options
	}

	sendUSERSTATE = channelName => {
		this.connection.send(renderMessage({
			template: () => ({
				'badge-info': null,
				badges: null,
				color: this.color,
				'display-name': this.displayName,
				'emote-sets': 0,
				mod: 0,
				subscriber: 0,
				'user-type': null,
				message: `${HOST} USERSTATE #${channelName}`
			}),
		}))
	}





	/***************************************************************************\
		Getters
	\***************************************************************************/

	get connection () {
		return this.options.connection
	}

	get displayName () {
		return this.options.username
	}

	get username () {
		return this.options.username.toLowerCase()
	}
}

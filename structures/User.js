// Module imports
import { v4 as uuid } from 'uuid'
import tinycolor from 'tinycolor2'





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





	/***************************************************************************\
		Getters
	\***************************************************************************/

	get displayName () {
		return this.options.username
	}

	get username () {
		return this.options.username.toLowerCase()
	}
}

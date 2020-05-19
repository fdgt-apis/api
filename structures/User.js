// Module imports
const { v4: uuid } = require('uuid')
const tinycolor = require('tinycolor2')





class User {
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

	get username () {
		return this.options.username
	}
}





module.exports = User

// Local imports
const Collection = require('./Collection')





module.exports = class extends Collection {
	/***************************************************************************\
		Public Methods
	\***************************************************************************/

	findByUsername = username => this.findByKey('username', username)





	/***************************************************************************\
		Getters
	\***************************************************************************/

	get usernames () {
		return this.data.map(({ username }) => username)
	}
}

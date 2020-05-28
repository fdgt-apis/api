// Local imports
const Collection = require('./Collection')





module.exports = class extends Collection {
	/***************************************************************************\
		Public Methods
	\***************************************************************************/

	findByName = name => this.findByKey('name', name.replace(/^#/, '').toLowerCase())





	/***************************************************************************\
		Getters
	\***************************************************************************/

	get channelNames () {
		return this.data.map(({ name }) => name)
	}
}

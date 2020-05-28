// Local imports
import Collection from './Collection'





export default class extends Collection {
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

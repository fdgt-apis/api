// Local imports
import Collection from './Collection'





export default class extends Collection {
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

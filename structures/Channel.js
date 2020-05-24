// Module imports
const { v4: uuid } = require('uuid')





// Local imports
const renderMessage = require('../helpers/renderMessage')
const serializeTwitchObject = require('../helpers/serializeTwitchObject')
const UserList = require('./UserList')





// Local constants
const { HOST } = process.env





class Channel extends UserList {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	emoteOnly = false

	followersOnly = false

	id = uuid()

	isConnected = false

	subsOnly = false





	/***************************************************************************\
		Public Methods
	\***************************************************************************/

	addUser = this.add

	connect = options => {
		const { user } = options

		if (user) {
			this.addUser(user)
		}

		this.isConnected = true
	}

	constructor (options) {
		super(options)

		if (options.name) {
			options.name = options.name
				.replace(/^#/u, '')
				.toLowerCase()
		}

		this.options = options

		this.isConnected = Boolean(options.isConnected)
	}

	disconnect = () => {
		this.isConnected = false
	}

	getRandomUser = this.getRandom

	removeUser = this.remove

	sendErrorMessage = error => {
		const user = this.connection.fdgtUser

		this.connection.send(renderMessage({
			channel: this,
			template: () => ({
				'badge-info': [],
				badges: [],
				color: user.color,
				'display-name': user.username,
				emotes: null,
				flags: null,
				id: uuid(),
				mod: 0,
				'room-id': this.id,
				subscriber: 0,
				'tmi-sent-ts': Date.now(),
				turbo: 0,
				'user-id': user.id,
				'user-type': null,
				message: `${user.username}!${user.username}@${user.username}.${HOST} PRIVMSG #${this.name} :${error}`,
			}),
			user,
		}))
	}





	/***************************************************************************\
		Getters
	\***************************************************************************/

	get connection () {
		return this.options.connection
	}

	get hashName () {
		return `#${this.options.name}`
	}

	get name () {
		return this.options.name
	}
}





module.exports = Channel

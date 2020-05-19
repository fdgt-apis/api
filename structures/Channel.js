// Module imports
const { v4: uuid } = require('uuid')





// Local imports
const renderTemplate = require('../helpers/renderTemplate')
const serializeTwitchObject = require('../helpers/serializeTwitchObject')
const UserList = require('./UserList')





class Channel extends UserList {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	id = uuid()

	isConnected = false





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

	sendMessage = options => {
		const {
			args = {},
			user = this.connection.fdgtUser,
		} = options

		const template = {
			'badge-info': [],
			badges: [],
			color: '<color>',
			'display-name': '<username>',
			emotes: null,
			flags: null,
			id: uuid(),
			mod: 0,
			'room-id': '<channelid>',
			subscriber: 0,
			'tmi-sent-ts': '<timestamp>',
			turbo: 0,
			'user-id': '<userid>',
			'user-type': null,
			message: '<username>!<username>@<username>.<host> PRIVMSG #<channel> :<message>'
		}

		const response = renderTemplate({
			args,
			channel: this,
			template,
			user,
		})

		this.connection.send(`@${serializeTwitchObject(response.tags)} :${response.message}`)
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

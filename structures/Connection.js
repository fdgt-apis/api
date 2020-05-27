// Module imports
const { parse: parseIRCMessage } = require('irc-message')
const { v4: uuid } = require('uuid')
const EventEmitter = require('events')





// Local imports
const Channel = require('../structures/Channel')
const ChannelList = require('../structures/ChannelList')
const log = require('../helpers/log')
const handleCAPMessage = require('../helpers/handleCAPMessage')
const handleJOINMessage = require('../helpers/handleJOINMessage')
const handleNICKMessage = require('../helpers/handleNICKMessage')
const handlePARTMessage = require('../helpers/handlePARTMessage')
const handlePASSMessage = require('../helpers/handlePASSMessage')
const handlePINGMessage = require('../helpers/handlePINGMessage')
const handlePONGMessage = require('../helpers/handlePONGMessage')
const handlePRIVMSGMessage = require('../helpers/handlePRIVMSGMessage')
const handleUSERMessage = require('../helpers/handleUSERMessage')
const handleQUITMessage = require('../helpers/handleQUITMessage')
const User = require('../structures/User')
const UserList = require('../structures/UserList')





// Local constants
const { HOST } = process.env





class Connection extends EventEmitter {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	capabilities = []

	channels = new ChannelList

	id = uuid()

	isAcknowledged = false

	pingIntervalID = null

	pongTimeoutID = null

	token = null

	username = null

	users = new UserList





	/***************************************************************************\
		Private Properties
	\***************************************************************************/

	#acknowledge = () => {
		this.isAcknowledged = true
		this.sendMOTD()
	}

	#handleMessages = rawMessages => {
		const messages = rawMessages.toString()
			.replace(/\r\n$/, '')
			.split('\r\n')
			.map(item => parseIRCMessage(item))

		messages.forEach(message => {
			let handler = null

			log('Message from client', message, 'info')

			switch (message.command) {
				case 'CAP':
					handler = handleCAPMessage
					break

				case 'JOIN':
					handler = handleJOINMessage
					break

				case 'NICK':
					handler = handleNICKMessage
					break

				case 'PART':
					handler = handlePARTMessage
					break

				case 'PASS':
					handler = handlePASSMessage
					break

				case 'PING':
					handler = handlePINGMessage
					break

				case 'PONG':
					handler = handlePONGMessage
					break

				case 'PRIVMSG':
					handler = handlePRIVMSGMessage
					break

				case 'USER':
					handler = handleUSERMessage
					break

				case 'QUIT':
					handler = handleQUITMessage
					break

				default:
					log(`No handler for ${message.command} messages`, {}, 'error')
					this.sendUnknownCommand(message.command)
			}

			if (handler) {
				handler(message, this)
			}
		})
	}

	#initializeConnectionCloseHandler = () => {
		const closeEvents = [
			'close',
			'end',
			'error',
		]

		closeEvents.forEach(eventType => {
			this.socket.on(eventType, () => this.close())
		})
	}

	#initializeMessageHandler = () => {
		if (this.#isWebsocket()) {
			this.socket.on('message', this.#handleMessages)
		} else {
			this.socket.on('data', this.#handleMessages)
		}
	}

	#initializePing = () => {
		// Ping the client every 30 seconds. Otherwise, Heroku will kill the
		// connection.
		this.pingIntervalID = setInterval(() => {
			const { id } = this

			this.pongTimeoutID = setTimeout(() => {
				log('Client didn\'t PONG in time - terminating connection', { id }, 'error')

				clearInterval(this.pingIntervalID)

				this.close()
			}, 5000)

			log('Pinging client', { id }, 'info')

			this.send('PING')
		}, 30000)
	}

	#isIRCSocket = () => (this.type === 'irc')

	#isWebsocket = () => (this.type === 'websocket')





	/***************************************************************************\
		Public Properties
	\***************************************************************************/

	addCapabilities = capabilities => {
		this.capabilities = [
			...this.capabilities,
			...capabilities,
		]
	}

	close = () => {
		clearTimeout(this.pongTimeoutID)
		clearInterval(this.pingIntervalID)

		if (this.#isWebsocket()) {
			this.socket.terminate()
		} else {
			this.socket.end()
		}

		this.emit('close')
	}

	constructor (options) {
		super()

		this.options = options

		log('New client connected', { id: this.id }, 'info')

		this.once('acknowledge', this.#acknowledge)

		this.#initializeConnectionCloseHandler()
		this.#initializeMessageHandler()
		this.#initializePing()
	}

	getChannel = (channelName, create = true) => {
		let channel = this.channels.findByName(channelName)

		if (!channel && create) {
			channel = new Channel({
				connection: this,
				name: channelName,
			})
			this.channels.add(channel)
		}

		return channel
	}

	getUser = (username, create = true) => {
		let user = this.users.findByUsername(username)

		if (!user && create) {
			user = new User({ username })
			this.users.add(user)
		}

		return user
	}

	send = response => {
		let messages = response

		if (!Array.isArray(messages)) {
			messages = [messages]
		}

		try {
			messages.forEach(message => {
				log(`Sending message to client: ${message}`)
				if (this.#isWebsocket()) {
					this.socket.send(message)
				} else {
					this.socket.write(`${message}\r\n`)
				}
			})
		} catch (error) {
			log('Failed to send response', {}, 'error')
		}
	}

	sendMOTD = () => {
		this.send([
			`:${HOST} 001 ${this.username} :Welcome, GLHF!`, // WELCOME
			`:${HOST} 002 ${this.username} :Your host is ${HOST}`, // YOURHOST
			`:${HOST} 003 ${this.username} :This server is rather new`, // CREATED
			`:${HOST} 004 ${this.username} :-`, // MYINFO
			`:${HOST} 375 ${this.username} :-`, // MOTDSTART
			`:${HOST} 372 ${this.username} :You are in a maze of twisty passages, all alike.`, // MOTD
			`:${HOST} 376 ${this.username} :>`, // MOTDEND
		])
	}

	sendPong = () => {
		this.send('PONG')
	}

	sendUnknownCommand = command => {
		this.send(`:${HOST} 421 ${this.username} ${command} :Unknown command`)
	}





	/***************************************************************************\
		Getters
	\***************************************************************************/

	get fdgtUser () {
		return this.options.fdgtUser
	}

	get socket () {
		return this.options.socket
	}

	get type () {
		if (this.socket.send) {
			return 'websocket'
		}

		return 'irc'
	}
}





module.exports = Connection

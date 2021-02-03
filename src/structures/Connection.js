// Module imports
import { parse as parseIRCMessage } from 'irc-message'
import { v4 as uuid } from 'uuid'
import EventEmitter from 'events'





// Local imports
import {
	decrementStat,
	incrementStat,
} from 'helpers/updateStat'
import { getApp } from 'helpers/apps'
import Channel from 'structures/Channel'
import ChannelList from 'structures/ChannelList'
import log from 'helpers/log'
import handleCAPMessage from 'helpers/handleCAPMessage'
import handleJOINMessage from 'helpers/handleJOINMessage'
import handleNICKMessage from 'helpers/handleNICKMessage'
import handlePARTMessage from 'helpers/handlePARTMessage'
import handlePASSMessage from 'helpers/handlePASSMessage'
import handlePINGMessage from 'helpers/handlePINGMessage'
import handlePONGMessage from 'helpers/handlePONGMessage'
import handlePRIVMSGMessage from 'helpers/handlePRIVMSGMessage'
import handleUSERMessage from 'helpers/handleUSERMessage'
import handleQUITMessage from 'helpers/handleQUITMessage'
import User from 'structures/User'
import UserList from 'structures/UserList'





// Local constants
const { HOST } = process.env





export default class extends EventEmitter {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	app = null

	capabilities = []

	channels = new ChannelList

	capabilitiesFinished = false

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
		if (this.username && this.capabilitiesFinished && (this.token || /^justinfan\d+$/.test(this.username))) {
			this.off('acknowledge', this.#acknowledge)
			this.isAcknowledged = true
			this.sendMOTD()
		}
	}

	#handleMessages = rawMessages => {
		const messages = rawMessages.toString()
			.replace(/\r\n$/, '')
			.split('\r\n')
			.map(item => parseIRCMessage(item))

		incrementStat('messagesReceived', messages.length)

		messages.forEach(message => {
			let handler = null

			this.#log('Message from client', { message: message.raw }, 'info')

			switch (message.command.toUpperCase()) {
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
					this.#log(`No handler for ${message.command} messages`, {}, 'error')
					this.sendUnknownCommand(message.command)
			}

			if (handler) {
				handler(message, this)
			}
		})
	}

	#initialize () {
		this.on('acknowledge', this.#acknowledge)

		const appID = this.options.query.token || this.options.headers.Authorization?.replace(/^Bearer\s/, '')
		getApp(appID, this.id)
			.then(app => this.app = app)

		this.#initializeConnectionCloseHandler()
		this.#initializeMessageHandler()
		this.#initializePing()
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
				this.#log('Client didn\'t PONG in time - terminating connection', {}, 'error')

				clearInterval(this.pingIntervalID)

				this.close()
			}, 5000)

			this.#log('Pinging client', {}, 'info')

			this.send(`PING :${HOST}`)
		}, 30000)
	}

	#isIRCSocket = () => (this.type === 'irc')

	#isWebsocket = () => (this.type === 'websocket')

	#log (message, meta, type) {
		const compiledMeta = {
			...(meta || {}),
			appID: null,
			connectionID: this.id,
		}

		if (this.app) {
			compiledMeta.appID = this.app.id
		}

		log(message, compiledMeta, type)
	}





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

		decrementStat('activeConnections')

		this.emit('close')
	}

	constructor (options) {
		super()

		this.options = options

		this.#log('New client connected', { type: this.type }, 'info')
		incrementStat('connections')
		incrementStat('activeConnections')

		this.#initialize()
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

	getUser = username => {
		let user = this.users.findByUsername(username)

		if (!user) {
			user = new User({
				connection: this,
				username,
			})
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
			incrementStat('messagesSent', messages.length)
			messages.forEach(message => {
				this.#log(`Sending message to client`, { message })
				incrementStat('messagesSent')
				if (this.#isWebsocket()) {
					this.socket.send(message)
				} else {
					this.socket.write(`${message}\r\n`)
				}
			})
		} catch (error) {
			this.#log('Failed to send response', {}, 'error')
		}
	}

	sendMOTD = () => {
		const motdMessages = [
			`:${HOST} 001 ${this.username} :Welcome, GLHF!`, // WELCOME
			`:${HOST} 002 ${this.username} :Your host is ${HOST}`, // YOURHOST
			`:${HOST} 003 ${this.username} :This server is rather new`, // CREATED
			`:${HOST} 004 ${this.username} :-`, // MYINFO
			`:${HOST} 375 ${this.username} :-`, // MOTDSTART
			`:${HOST} 372 ${this.username} :You are in a maze of twisty passages, all alike.`, // MOTD
			`:${HOST} 372 ${this.username} :Your FDGT connection ID is ${this.id}.`, // MOTD
			`:${HOST} 376 ${this.username} :>`, // MOTDEND
		]

		// if (this.app) {
		// 	motdMessages.splice(7, 0, `:${HOST} 372 ${this.username} :You can view the logs for this connection at https://fdgt.dev/dashboard/app/${this.app.id}.`)
		// }

		this.send(motdMessages)
	}

	sendPong = (payload) => {
		if (payload) {
			this.send(`PONG ${payload}`)
		} else {
			this.send(`PONG`)
		}
	}

	sendReconnect = () => {
		incrementStat('reconnects')
		this.send('RECONNECT')
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

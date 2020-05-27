// Module imports
const {
	spy,
	useFakeTimers,
} = require('sinon')
const { expect } = require('chai')
const { parse: parseIRCMessage } = require('irc-message')
const { v4: uuid } = require('uuid')
const EventEmitter = require('events')
const faker = require('faker')





// Local imports
const CAPABILITIES = require('../../data/CAPABILITIES')
const Channel = require('../../structures/Channel')
const Connection = require('../../structures/Connection')
const User = require('../../structures/User')





// Local constants
const testChannelName = 'TestChannel'
const testUsername = 'Bob'
const ircSocket = class extends EventEmitter {
	end = () => {}
	write = () => {}
}
const wsSocket = class extends EventEmitter {
	send = () => {}
	terminate = () => {}
}





describe('Connection', function() {
	const clock = useFakeTimers()
	const fdgtUser = new User({ username: 'fdgt' })

	let connection = null
	let socket = null

	beforeEach(() => {
		socket = new wsSocket
		connection = new Connection({
			fdgtUser,
			socket,
		})

		spy(connection)
		spy(socket)
	})

	afterEach(() => {
		connection.close()
		connection = null
		socket = null
	})

	describe('new Connection', () => {
		describe('close events', () => {
			it('should close when the socket emits a `close` event', () => {
				socket.emit('close')
				expect(connection.close.calledOnce).to.be.true
			})

			it('should close when the socket emits an `end` event', () => {
				socket.emit('end')
				expect(connection.close.calledOnce).to.be.true
			})

			it('should close when the socket emits an `error` event', () => {
				socket.emit('error')
				expect(connection.close.calledOnce).to.be.true
			})
		})

		describe('messages', () => {
			it('should send an unknown command for unrecognized events', () => {
				socket.emit('message', `:${testUsername}!${testUsername}@${testUsername}.tmi.twitch.tv PRIVMSG #${testChannelName.toLowerCase()} :foo`)
				const [[message]] = socket.send.args
				const {
					command,
					params: [
						channelName,
						eventName,
					],
				} = parseIRCMessage(message)
				expect(command).to.be.string('PRIVMSG')
				expect(channelName).to.be.string(`#${testChannelName.toLowerCase()}`)
				expect(eventName).to.be.string('foo')
				expect(socket.send.calledOnce).to.be.true
			})

			xdescribe('CAP commands', () => {})

			it('should send an unknown command for unrecognized events', () => {
				socket.emit('message', `:${testUsername}!${testUsername}@${testUsername}.tmi.twitch.tv PRIVMSG #${testChannelName.toLowerCase()} :foo`)
				const [[message]] = socket.send.args
				const {
					command,
					params: [
						channelName,
						eventName,
					],
				} = parseIRCMessage(message)
				expect(command).to.be.string('PRIVMSG')
				expect(channelName).to.be.string(`#${testChannelName.toLowerCase()}`)
				expect(eventName).to.be.string('foo')
				expect(socket.send.calledOnce).to.be.true
			})
		})

		xdescribe('ping pong', () => {})
	})

	describe('addCapabilities', () => {
		it('should only be called once', () => {
			connection.addCapabilities(CAPABILITIES)
			expect(connection.addCapabilities.calledOnce).to.be.true
		})

		it('should add capabilities to the connection', () => {
			connection.addCapabilities(CAPABILITIES)
			expect(connection.capabilities).to.have.members(CAPABILITIES)
		})
	})

	describe('close', () => {
		it('should only be called once', () => {
			connection.close()
			expect(connection.close.calledOnce).to.be.true
		})

		xit('should stop the ping timer', async () => {
			expect(connection.pingIntervalID).to.exist
			connection.close()
			await clock.runAllAsync()
			expect(connection.pingIntervalID).to.be.null
		})

		xit('should stop the pong timer', () => {
			connection.pongTimeoutID
			connection.close()
			expect(connection.close.calledOnce).to.be.true
		})

		it('should close the socket', () => {
			connection.close()
			expect(socket.terminate.calledOnce).to.be.true
		})

		it('should emit a `close` event', () => {
			connection.close()
			expect(connection.emit.calledOnceWithExactly('close')).to.be.true
		})
	})

	describe('getChannel', () => {
		it('should create a new channel and add it to the connection\'s channel list', () => {
			expect(connection.channels.isEmpty).to.be.true

			const channel = connection.getChannel(testChannelName)
			expect(channel).to.be.instanceof(Channel)
			expect(connection.channels.data).to.include(channel)
		})

		it('should retrieve an existing channel from the connection\'s channel list', () => {
			const channel = new Channel({ name: testChannelName })
			connection.channels.add(channel)
			expect(connection.channels.isEmpty).to.be.false

			const retrievedChannel = connection.getChannel(testChannelName.toLowerCase())
			expect(retrievedChannel).to.equal(channel)
		})
	})

	describe('getUser', () => {
		it('should create a new user and add it to the connection\'s user list', () => {
			expect(connection.users.isEmpty).to.be.true

			const user = connection.getUser(testUsername)
			expect(user).to.be.instanceof(User)
			expect(connection.users.data).to.include(user)
		})

		it('should retrieve an existing user from the connection\'s user list', () => {
			const user = new User({ username: testUsername })
			connection.users.add(user)
			expect(connection.users.isEmpty).to.be.false

			const retrievedUser = connection.getUser(testUsername.toLowerCase())
			expect(retrievedUser).to.equal(user)
		})
	})

	describe('send', () => {
		it('sends a single message', () => {
			const testMessage = faker.lorem.sentences()
			connection.send(testMessage)
			expect(socket.send.calledOnceWithExactly(testMessage)).to.be.true
		})

		it('sends multiple messages', () => {
			const testMessages = Array(10).fill(null).map(() => faker.lorem.sentences())
			connection.send(testMessages)

			testMessages.forEach((message, index) => {
				expect(socket.send.getCall(index).calledWithExactly(message)).to.be.true
			})
		})
	})

	describe('sendMOTD', () => {
		beforeEach(() => {
			connection.sendMOTD()
		})

		it('should send the "Message of the Day"', () => {
			expect(socket.send.callCount).to.be.at.least(7)
		})

		it('should send a WELCOME message', () => {
			const sendCalls = socket.send.getCalls()
			const messageSent = sendCalls.some(({ args: [message] }) => {
				const { command } = parseIRCMessage(message)
				return (command === '001')
			})

			expect(messageSent).to.be.true
		})

		it('should send a YOURHOST message', () => {
			const sendCalls = socket.send.getCalls()
			const messageSent = sendCalls.some(({ args: [message] }) => {
				const { command } = parseIRCMessage(message)
				return (command === '002')
			})

			expect(messageSent).to.be.true
		})

		it('should send a CREATED message', () => {
			const sendCalls = socket.send.getCalls()
			const messageSent = sendCalls.some(({ args: [message] }) => {
				const { command } = parseIRCMessage(message)
				return (command === '003')
			})

			expect(messageSent).to.be.true
		})

		it('should send a MYINFO message', () => {
			const sendCalls = socket.send.getCalls()
			const messageSent = sendCalls.some(({ args: [message] }) => {
				const { command } = parseIRCMessage(message)
				return (command === '004')
			})

			expect(messageSent).to.be.true
		})

		it('should send a MOTDSTART message', () => {
			const sendCalls = socket.send.getCalls()
			const messageSent = sendCalls.some(({ args: [message] }) => {
				const { command } = parseIRCMessage(message)
				return (command === '375')
			})

			expect(messageSent).to.be.true
		})

		it('should send a MOTD message', () => {
			const sendCalls = socket.send.getCalls()
			const messageSent = sendCalls.some(({ args: [message] }) => {
				const { command } = parseIRCMessage(message)
				return (command === '372')
			})

			expect(messageSent).to.be.true
		})

		it('should send a MOTDEND message', () => {
			const sendCalls = socket.send.getCalls()
			const messageSent = sendCalls.some(({ args: [message] }) => {
				const { command } = parseIRCMessage(message)
				return (command === '376')
			})

			expect(messageSent).to.be.true
		})
	})

	describe('sendPong', () => {
		beforeEach(() => {
			connection.sendPong()
		})

		it('should only be called once', () => {
			expect(connection.send.calledOnce)
		})

		it('should send a PONG message', () => {
			expect(connection.send.calledOnceWithExactly('PONG')).to.be.true
		})
	})

	describe('sendUnknownCommand', () => {
		it('should only be called once', () => {
			connection.sendUnknownCommand('foo')
			expect(connection.send.calledOnce).to.be.true
		})

		it('should send an UNKNOWN command', () => {
			connection.sendUnknownCommand('foo')

			const [[message]] = connection.send.args
			const { command } = parseIRCMessage(message)

			expect(command).to.be.string('421')
		})
	})
})

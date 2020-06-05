// Module imports
import { parse as parseIRCMessage } from 'irc-message'
import { spy } from 'sinon'
import { expect } from 'chai'
import EventEmitter from 'events'
import validateUUID from 'uuid-validate'





// Local imports
import Channel from '../../src/structures/Channel'
import Connection from '../../src/structures/Connection'
import User from '../../src/structures/User'





// Local constants
const testErrorMessage = 'Error foo bar baz!'
const testChannelName = 'TestChannel'
const ircSocket = class extends EventEmitter {
	end = () => {}
	write = () => {}
}
const wsSocket = class extends EventEmitter {
	send = () => {}
	terminate = () => {}
}





describe('Channel', function() {
	const fdgtUser = new User({ username: 'fdgt' })
	const user = new User()
	let connection = null
	let channel = null
	let socket = null

	beforeEach(() => {
		socket = new wsSocket
		connection = new Connection({
			fdgtUser,
			socket,
		})
		channel = new Channel({
			connection,
			name: testChannelName,
		})
		spy(channel)
		spy(connection)
		spy(socket)
	})

	afterEach(() => {
		connection.close()
		channel = null
		connection = null
		socket = null
	})

	describe('before connecting', () => {
		describe('connection', () => {
			it('should be a Connection', () => {
				expect(channel.connection).to.be.instanceof(Connection)
			})
		})

		describe('emoteOnly', () => {
			it('should be off when the channel is first created', () => {
				expect(channel.emoteOnly).to.be.false
			})
		})

		describe('followersOnly', () => {
			it('should be off when the channel is first created', () => {
				expect(channel.followersOnly).to.be.false
			})
		})

		describe('hashName', () => {
			it('should match the channel name', () => {
				expect(channel.hashName).to.be.string(`#${testChannelName.toLowerCase()}`)
			})
		})

		describe('id', () => {
			it('should be a valid UUID', () => {
				expect(channel.id).to.satisfy(validateUUID)
			})
		})

		describe('isConnected', () => {
			it('should be false when the channel is first created', () => {
				expect(channel.isConnected).to.be.false
			})
		})

		describe('name', () => {
			it('should match the passed in channel name', () => {
				expect(channel.name).to.be.string(testChannelName.toLowerCase())
			})
		})

		describe('subsOnly', () => {
			it('should be off when the channel is first created', () => {
				expect(channel.subsOnly).to.be.false
			})
		})
	})

	describe('public methods', () => {
		describe('addUser', () => {
			it('should only be called once', () => {
				channel.addUser(user)
				expect(channel.addUser.calledOnce).to.be.true
			})

			it('should add the passed user to the channel\'s user list', () => {
				channel.addUser(user)
				expect(channel.data).to.include(user)
			})
		})

		describe('connect', () => {
			it('should only be called once', () => {
				channel.connect()
				expect(channel.connect.calledOnce).to.be.true
			})

			it('should change the channel\'s connected state', () => {
				channel.connect()
				expect(channel.isConnected).to.be.true
			})

			it('should add the current user to the channel\'s user list', () => {
				channel.connect({ user })
				expect(channel.addUser.calledOnce).to.be.true
				expect(channel.data).to.include(user)
			})
		})

		describe('disconnect', () => {
			beforeEach(() => {
				channel.connect({ user })
			})

			it('should only be called once', () => {
				channel.disconnect()
				expect(channel.disconnect.calledOnce).to.be.true
			})

			it('should change the channel\'s connected state', () => {
				channel.disconnect()
				expect(channel.isConnected).to.be.false
			})
		})

		describe('removeUser', () => {
			beforeEach(() => {
				channel.addUser(user)
			})

			it('should only be called once', () => {
				channel.removeUser(user)
				expect(channel.removeUser.calledOnce).to.be.true
			})

			it('should remove the passed user from the channel\'s user list', () => {
				channel.removeUser(user)
				expect(channel.data).to.not.include(user)
			})
		})

		describe('sendErrorMessage', () => {
			it('should only be called once', () => {
				channel.sendErrorMessage(testErrorMessage)
				expect(channel.sendErrorMessage.calledOnce).to.be.true
			})

			it('should send via the channel\'s Connection', () => {
				channel.sendErrorMessage(testErrorMessage)
				expect(socket.send.callCount).to.equal(1)
			})

			it('should send the passed message', () => {
				channel.sendErrorMessage(testErrorMessage)

				const [rawMessage] = socket.send.getCall(0).args
				const { params: [channelName, ...[message]] } = parseIRCMessage(rawMessage)

				expect(channelName).to.be.string(`#${testChannelName.toLowerCase()}`)
				expect(message).to.be.string(testErrorMessage)
			})
		})
	})
})

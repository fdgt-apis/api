// Module imports
import {
	spy,
	useFakeTimers,
} from 'sinon'
import { expect } from 'chai'
import { parse as parseIRCMessage } from 'irc-message'
import { v4 as uuid } from 'uuid'
import EventEmitter from 'events'
import faker from 'faker'





// Local imports
import CAPABILITIES from 'data/CAPABILITIES'
import Channel from 'structures/Channel'
import Connection from 'structures/Connection'
import User from 'structures/User'





// Local constants
const testChannelName = 'TestChannel'
const testOauthToken = 'oauth:1234567890'
const testUsername = 'Bob'
const ircSocket = class extends EventEmitter {
	end = () => {}
	write = () => {}
}
const wsSocket = class extends EventEmitter {
	send = () => {}
	terminate = () => {}
}





describe('bits events', function() {
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

		socket.emit('message', `NICK ${testUsername}`)
		socket.emit('message', `PASS ${testOauthToken}`)
		socket.emit('message', `CAP REQ ${CAPABILITIES.join(' ')}`)
		socket.emit('message', 'CAP END')
		socket.emit('message', `JOIN #${testChannelName}`)

		spy(connection)
		spy(socket)
	})

	afterEach(() => {
		connection.close()
		connection = null
		socket = null
	})

	it('should simulate a `bits` event', () => {
		socket.emit('message', `PRIVMSG #${testChannelName} :bits`)

		const rawMessage = connection.send.getCall(0)?.firstArg
		const { tags } = parseIRCMessage(rawMessage)

		expect(tags.bits).to.exist
	})

	it('should forward the message', () => {
		const message = faker.lorem.sentence()
		socket.emit('message', `PRIVMSG #${testChannelName} :bits ${message}`)

		const rawMessage = connection.send.getCall(0).firstArg
		const {
			params: [, forwardedMessage],
			tags,
		} = parseIRCMessage(rawMessage)

		expect(forwardedMessage).to.equal(message)
	})

	it('should send the correct amount of bits', () => {
		socket.emit('message', `PRIVMSG #${testChannelName} :bits --bitscount 99999`)

		const rawMessage = connection.send.getCall(0).firstArg
		const { tags } = parseIRCMessage(rawMessage)

		expect(tags.bits).to.equal('99999')
	})
})

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
import { createConnection } from '../test-helpers/createConnection'
import CAPABILITIES from 'data/CAPABILITIES'





// Local constants
const testChannelName = 'TestChannel'
const testOauthToken = 'oauth:1234567890'
const testUsername = 'Bob'





describe('reconnect events', function() {
	const clock = useFakeTimers()

	let connection = null
	let socket = null

	beforeEach(() => {
		connection = createConnection()
		socket = connection.socket

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

	it('should simulate a `reconnect` event', () => {
		socket.emit('message', `PRIVMSG #${testChannelName} :reconnect`)

		const rawMessage = connection.send.getCall(0)?.firstArg
		const responseMessage = parseIRCMessage(rawMessage)

		expect(responseMessage.command).to.equal('RECONNECT')
	})
})

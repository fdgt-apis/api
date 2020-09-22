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
import Channel from 'structures/Channel'





// Local constants
const testChannelName = 'TestChannel'
const testOauthToken = 'oauth:1234567890'
const testUsername = 'Bob'





describe('bits events', function() {
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

	it('should simulate a `bits` event', () => {
		socket.emit('message', `PRIVMSG #${testChannelName} :bits`)

		const rawMessage = connection.send.getCall(0)?.firstArg
		const { tags } = parseIRCMessage(rawMessage)

		expect(tags.bits).to.exist
	})

	describe('with message', () => {
		it('should forward the message', () => {
			const message = faker.lorem.sentence()
			socket.emit('message', `PRIVMSG #${testChannelName} :bits ${message}`)

			const rawMessage = connection.send.getCall(0).firstArg
			const {
				params: [, forwardedMessage],
				tags,
			} = parseIRCMessage(rawMessage)

			expect(forwardedMessage).to.include(message)
		})

		it('should attach a cheermote with the default amount of bits', () => {
			const message = faker.lorem.sentence()

			socket.emit('message', `PRIVMSG #${testChannelName} :bits ${message}`)

			const rawMessage = connection.send.getCall(0).firstArg
			const {
				params: [, forwardedMessage],
				tags,
			} = parseIRCMessage(rawMessage)

			expect(tags.bits).to.equal('100')
			expect(forwardedMessage).to.equal(`${message} cheer100`)
		})

		it('should send the amount of bits defined by cheermotes in the message', () => {
			const message = 'foo cheer1000 bar cheer1000 baz'

			socket.emit('message', `PRIVMSG #${testChannelName} :bits ${message}`)

			const rawMessage = connection.send.getCall(0).firstArg
			const { tags } = parseIRCMessage(rawMessage)

			expect(tags.bits).to.equal('2000')
		})

		it('should attach a cheermote with the amount of bits defined by `--bitscount`', () => {
			const message = faker.lorem.sentence()
			const bitscount = 99999

			socket.emit('message', `PRIVMSG #${testChannelName} :bits --bitscount ${bitscount} ${message}`)

			const rawMessage = connection.send.getCall(0).firstArg
			const {
				params: [, forwardedMessage],
				tags,
			} = parseIRCMessage(rawMessage)

			expect(forwardedMessage).to.equal(`${message} cheer${bitscount}`)
		})
	})

	describe('without message', () => {
		it('should attach a cheermote with the default amount of bits', () => {
			socket.emit('message', `PRIVMSG #${testChannelName} :bits`)

			const rawMessage = connection.send.getCall(0).firstArg
			const {
				params: [, message],
				tags,
			} = parseIRCMessage(rawMessage)

			expect(tags.bits).to.equal('100')
			expect(message).to.equal('cheer100')
		})

		it('should attach a cheermote with the amount of bits defined by `--bitscount`', () => {
			const bitscount = 99999

			socket.emit('message', `PRIVMSG #${testChannelName} :bits --bitscount ${bitscount}`)

			const rawMessage = connection.send.getCall(0).firstArg
			const {
				params: [, message],
				tags,
			} = parseIRCMessage(rawMessage)

			expect(message).to.equal(`cheer${bitscount}`)
		})
	})
})

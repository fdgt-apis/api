// Module imports
import {
	spy,
	useFakeTimers,
} from 'sinon'
import { parse as parseIRCMessage } from 'irc-message'
import { v4 as uuid } from 'uuid'
import { expect } from 'chai'
import EventEmitter from 'events'
import faker from 'faker'





// Local imports
import { createConnection } from '../test-helpers/createConnection'
import CAPABILITIES from 'data/CAPABILITIES'
import Channel from 'structures/Channel'
import User from 'structures/User'





// Local constants
const testChannelName = 'TestChannel'
const testOauthToken = 'oauth:1234567890'
const testUsername = 'Bob'





describe('Connection', function() {
	const clock = useFakeTimers()

	let connection = null
	let socket = null

	beforeEach(() => {
		connection = createConnection()
		socket = connection.socket

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

		describe('commands', () => {
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

			describe('CAP', () => {
				['LIST', 'LS'].forEach(subcommand => {
					describe(`${subcommand} subcommand`, () => {
						it('should list all available capabilities', () => {
							socket.emit('message', `CAP ${subcommand} 302`)

							const [[rawMessage]] = socket.send.args
							const {
								params: [
									client,
									responseSubcommand,
									capabilitiesList
								],
							} = parseIRCMessage(rawMessage)

							const capabilities = capabilitiesList.split(' ')

							expect(client).to.be.string('*')
							expect(responseSubcommand).to.be.string(subcommand)
							expect(capabilities).to.have.members(CAPABILITIES)
						})
					})
				})

				describe('END subcommand', () => {
					it('should send the MOTD if the user\'s NICK and PASS have already been set', () => {
						socket.emit('message', `PASS ${testOauthToken}`)
						socket.emit('message', `NICK ${testUsername}`)
						socket.emit('message', 'CAP END')

						expect(connection.sendMOTD.calledOnce).to.be.true
					})
				})

				describe('REQ subcommand', () => {
					it('should acknowledge capabilities', () => {
						socket.emit('message', `CAP REQ ${CAPABILITIES.join(' ')}`)

						const [[rawMessage]] = socket.send.args
						const {
							params: [
								client,
								responseSubcommand,
								requestedCapabilitiesList
							],
						} = parseIRCMessage(rawMessage)

						const requestedCapabilities = requestedCapabilitiesList.split(' ')

						expect(responseSubcommand).to.be.string('ACK')
						expect(requestedCapabilities).to.have.members(CAPABILITIES)
					})

					it('should ignore unrecognized capabilities', () => {
						socket.emit('message', `CAP REQ ${CAPABILITIES.join(' ')} foobar`)

						const [[rawMessage]] = socket.send.args
						const {
							params: [
								client,
								responseSubcommand,
								requestedCapabilitiesList
							],
						} = parseIRCMessage(rawMessage)

						const requestedCapabilities = requestedCapabilitiesList.split(' ')

						expect(responseSubcommand).to.be.string('ACK')
						expect(requestedCapabilities).to.have.members(CAPABILITIES)
						expect(requestedCapabilities).to.not.have.members(['foobar'])
					})
				})
			})

			describe('JOIN', () => {
				beforeEach(() => {
					socket.emit('message', `NICK ${testUsername}`)
					socket.emit('message', `PASS ${testOauthToken}`)
					socket.emit('message', `CAP REQ ${CAPABILITIES.join(' ')}`)
					socket.emit('message', 'CAP END')
					socket.emit('message', `JOIN #${testChannelName}`)
				})

				it('should add user to the channel', () => {
					const channel = connection.channels.findByName(testChannelName)
					const user = connection.users.findByUsername(testUsername.toLowerCase())

					expect(channel.findByUsername(testUsername.toLowerCase())).to.equal(user)
				})

				it('should respond with a JOIN message', () => {
					const messages = socket.send.getCalls().map(({ args }) => parseIRCMessage(args[0]))
					const messageSent = messages.some(({ command }) => (command === 'JOIN'))

					expect(messageSent).to.be.true
				})

				it('should respond with a NAMREPLY message', () => {
					const messages = socket.send.getCalls().map(({ args }) => parseIRCMessage(args[0]))
					const messageSent = messages.some(({ command }) => (command === '353'))

					expect(messageSent).to.be.true
				})

				it('should respond with an ENDOFNAMES message', () => {
					const messages = socket.send.getCalls().map(({ args }) => parseIRCMessage(args[0]))
					const messageSent = messages.some(({ command }) => (command === '366'))

					expect(messageSent).to.be.true
				})
			})

			describe('NICK', () => {
				it('should set the username on the connection', () => {
					socket.emit('message', `NICK ${testUsername}`)
					expect(connection.username).to.be.string(testUsername)
				})

				it('should send the MOTD if capabilities have been requested and the token has been set', () => {
					socket.emit('message', `CAP REQ ${CAPABILITIES.join(' ')}`)
					socket.emit('message', 'CAP END')
					socket.emit('message', `PASS ${testUsername}`)
					socket.emit('message', `NICK ${testUsername}`)

					expect(connection.sendMOTD.calledOnce).to.be.true
				})
			})

			describe('PART', () => {
				beforeEach(() => {
					socket.emit('message', `NICK ${testUsername}`)
					socket.emit('message', `PASS ${testOauthToken}`)
					socket.emit('message', `CAP REQ ${CAPABILITIES.join(' ')}`)
					socket.emit('message', 'CAP END')
					socket.emit('message', `JOIN #${testChannelName}`)
				})

				it('should remove user from the channel', () => {
					const channel = connection.channels.findByName(testChannelName.toLowerCase())
					const user = connection.users.findByUsername(testUsername.toLowerCase())

					socket.emit('message', `PART #${testChannelName}`)

					expect(channel.findByUsername(testUsername.toLowerCase())).to.not.exist
				})

				it('should respond with a PART message', () => {
					socket.emit('message', `PART #${testChannelName}`)

					const messages = socket.send.getCalls().map(({ args }) => parseIRCMessage(args[0]))
					const messageSent = messages.some(({ command }) => (command === 'PART'))

					expect(messageSent).to.be.true
				})
			})

			describe('PASS', () => {
				it('should set the token on the connection', () => {
					socket.emit('message', `PASS ${testOauthToken}`)
					expect(connection.token).to.be.string(testOauthToken)
				})

				it('should send the MOTD if capabilities have been requested and the username has been set', () => {
					socket.emit('message', `CAP REQ ${CAPABILITIES.join(' ')}`)
					socket.emit('message', 'CAP END')
					socket.emit('message', `NICK ${testUsername}`)
					socket.emit('message', `PASS ${testUsername}`)

					expect(connection.sendMOTD.calledOnce).to.be.true
				})
			})

			describe('PING', () => {
				it('should send a PONG message', () => {
					socket.emit('message', 'PING')
					expect(connection.send.calledOnceWithExactly('PONG')).to.be.true
				})
			})

			describe('PING with args', () => {
				it('should send a PONG message', () => {
					socket.emit('message', 'PING custom arg')
					expect(connection.send.calledOnceWithExactly('PONG custom arg')).to.be.true
				})
			})

			xdescribe('PONG', () => {
				it('should clear the ping timeout', () => {})
			})

			// Handled by FDGTCommands.test.js
			xdescribe('PRIVMSG', () => {})

			describe('QUIT', () => {
				it('should close the connection', () => {
					socket.emit('message', 'QUIT')
					expect(connection.close.calledOnce).to.be.true
				})
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

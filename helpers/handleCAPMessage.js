// Local constants
const CAPABILITIES = require('../data/CAPABILITIES')
const { HOST } = process.env





module.exports = (message, connection) => {
	const {
		addCapabilities,
		send,
		sendMOTD,
		sendUnknownCommand,
	} = connection
	const [subcommand, ...args] = message.params

	switch (subcommand) {
		case 'END':
			connection.capabilitiesFinished = true
			connection.emit('acknowledge')
			break

		case 'LIST':
		case 'LS':
			send(`:${HOST} CAP * ${subcommand} ${CAPABILITIES.join(' ')}`)
			break

		case 'REQ':
			addCapabilities(args)
			send(`:${HOST} CAP * ACK ${connection.capabilities.filter(capability => CAPABILITIES.includes(capability)).join(' ')}`)
			break

		default:
			sendUnknownCommand(`CAP ${subcommand}`)
	}
}

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
	const [subcommand, args] = message.params

	switch (subcommand) {
		case 'END':
			connection.emit('acknowledge')
			break

		case 'LIST':
		case 'LS':
			send(`:${HOST} CAP * LS ${CAPABILITIES.join(' ')}`)
			break

		case 'REQ':
			addCapabilities(args.split(' '))
			send(`:${HOST} CAP * ACK ${connection.capabilities.join(' ')}`)
			break

		default:
			sendUnknownCommand(`CAP ${subcommand}`)
	}
}

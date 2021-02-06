// Local imports
import CAPABILITIES from 'data/CAPABILITIES'





// Local constants
const { HOST } = process.env





export default (message, connection) => {
	const {
		addCapabilities,
		send,
		sendMOTD,
		sendUnknownCommand,
	} = connection
	const [subcommand, arg] = message.params

	switch (subcommand.toUpperCase()) {
		case 'END':
			connection.capabilitiesFinished = true
			connection.emit('acknowledge')
			break

		case 'LIST':
		case 'LS':
			send(`:${HOST} CAP * ${subcommand.toUpperCase()} :${CAPABILITIES.join(' ')}`)
			break

		case 'REQ':
			const capabilities = arg?.split(' ') ?? []
			addCapabilities(capabilities)
			send(`:${HOST} CAP * ACK :${capabilities.filter(capability => CAPABILITIES.includes(capability)).join(' ')}`)
			connection.capabilitiesFinished = true
			connection.emit('acknowledge')
			break

		default:
			sendUnknownCommand(`CAP ${subcommand.toUpperCase()}`)
	}
}

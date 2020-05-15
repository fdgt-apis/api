// Local constants
const CAPABILITIES = require('../data/CAPABILITIES')





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
      isAcknowledged = true
      sendMOTD()
      break

    case 'LIST':
    case 'LS':
      send(`CAP * LS ${CAPABILITIES.join(' ')}`)
      break

    case 'REQ':
      addCapabilities(args.split(' '))
      send(`CAP * ACK ${connection.capabilities.join(' ')}`)
      break

    default:
      sendUnknownCommand(`CAP ${subcommand}`)
  }
}

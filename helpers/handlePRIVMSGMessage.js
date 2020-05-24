// Module imports
const mri = require('mri')





// Local imports
const renderCommandResponse = require('../helpers/renderCommandResponse')
const User = require('../structures/User')





// Local constants
const { HOST } = process.env





module.exports = (messageData, connection) => {
	const {
		getChannel,
		getUser,
		send,
		username,
	} = connection
	const [channelName, message] = messageData.params

	const channel = getChannel(channelName)
	const {
		_: [command, ...messageBody],
		...args
	} = mri(message.split(' '))

	args.message = messageBody

	let user = getUser(username)

	if (args.username) {
		user = new User({ username: args.username })
	}

	const response = renderCommandResponse({
		args,
		channel,
		command,
		user,
	})

	if (response) {
		send(response)
	} else {
		channel.sendErrorMessage(`FDGT doesn't support the "${command}" command.`)
	}
}

// Module imports
const mri = require('mri')





// Local imports
const getMock = require('../helpers/getMock')
const User = require('../structures/User')





// Local constants
const HOST = 'tmi.twitch.tv'





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

	const response = getMock({
		args,
		channel,
		command,
		user,
	})

	if (response) {
		send(response)
	} else {
		channel.sendMessage({
			args: {
				message: `FDGT doesn't support ${command} events.`,
			},
		})
	}
}

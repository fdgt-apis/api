// Local imports
import { incrementStat } from 'helpers/updateStat'
import Channel from 'structures/Channel'
import User from 'structures/User'





// Local constants
const { HOST } = process.env





export default (message, connection) => {
	const {
		channels,
		getChannel,
		getUser,
		send,
		username,
		users,
	} = connection

	const channelsToJoin = message.params

	channelsToJoin.forEach(channelName => {
		const channel = getChannel(channelName)
		const user = getUser(username)
		incrementStat('channelsJoined')

		if (!channel.isConnected) {
			channel.connect({ user })
		}

		send([
			`:${username}!${username}@${username}.${HOST} JOIN #${channel.name}`,
			`:${username}.${HOST} 353 ${username} = #${channel.name} :${username}`,
			`:${username}.${HOST} 366 ${username} #${channel.name} :End of /NAMES list`,
		])

		user.sendUSERSTATE(channel.name)
		channel.sendROOMSTATE()
	})
}

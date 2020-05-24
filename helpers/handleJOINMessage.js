// Local imports
const Channel = require('../structures/Channel')
const User = require('../structures/User')





// Local constants
const { HOST } = process.env





module.exports = (message, connection) => {
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

		if (!channel.isConnected) {
			channel.connect({ user })
		}

		send([
			`:${username}!${username}@${username}.${HOST} JOIN #${channel.name}`,
			`:${username}.${HOST} 353 ${username} = #${channel.name} :${username}`,
			`:${username}.${HOST} 366 ${username} #${channel.name} :End of /NAMES list`,
			`@emote-only=${Number(channel.emoteOnly)};followers-only=${Number(channel.followersOnly)};r9k=0;rituals=0;room-id=${channel.id};slow=${Number(channel.slowMode)};subs-only=${Number(channel.subsOnly)} :tmi.twitch.tv ROOMSTATE #${channel.name}`,
		])
	})
}

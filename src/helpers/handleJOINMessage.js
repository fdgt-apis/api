// Local imports
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

		if (!channel.isConnected) {
			channel.connect({ user })
		}

		send([
			`:${username}!${username}@${username}.${HOST} JOIN #${channel.name}`,
			`:${username}.${HOST} 353 ${username} = #${channel.name} :${username}`,
			`:${username}.${HOST} 366 ${username} #${channel.name} :End of /NAMES list`,
			`@badge-info=;badges=;color=${user.color};display-name=${user.displayName};emote-sets=0;mod=0;subscriber=0;user-type= :tmi.twitch.tv USERSTATE #${channel.name}`,
			`@emote-only=${Number(channel.emoteOnly)};followers-only=${Number(channel.followersOnly)};r9k=0;rituals=0;room-id=${channel.id};slow=${Number(channel.slowMode)};subs-only=${Number(channel.subsOnly)} :tmi.twitch.tv ROOMSTATE #${channel.name}`,
		])
	})
}

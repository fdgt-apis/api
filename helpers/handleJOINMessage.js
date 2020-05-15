// Local imports
const Channel = require('../structures/Channel')
const User = require('../structures/User')





// Local constants
const HOST = 'tmi.twitch.tv'





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
      `@emote-only=0;followers-only=-1;r9k=0;rituals=0;room-id=${channel.id};slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #${channel.name}`,
    ])
  })
}

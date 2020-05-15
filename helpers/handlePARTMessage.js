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
  } = connection

  const channelsToPart = message.params

  channelsToPart.forEach(channelName => {
    const channel = getChannel(channelName, false)
    const user = getUser(username)

    if (channel) {
      channel.removeUser(user)
      send(`:${username}!${username}@${username}.${HOST} PART ${channel.hashName}`)
    } else {
      send(`:${HOST} 403 ${username} ${channelName} :No such channel`)
    }
  })
}

const defaults = {
	bitscount: 100,
}

module.exports = (args = {}) => {
	const {
		bitscount,
		color,
		channel,
		channelid,
		host,
		message,
		messageid,
		timestamp,
		userid,
		username,
	} = {
		...defaults,
		...args,
	}

	return {
		'badge-info': [],
		badges: [],
		bits: bitscount,
		color: color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		mod: 0,
		'room-id': channelid,
		subscriber: 0,
		'tmi-sent-ts': timestamp,
		turbo: 0,
		'user-id': userid,
		'user-type': null,
		message: `${username}!${username}@${username}.${host} PRIVMSG #${channel} :${message}`,
	}
}

const defaults = {
	tier: 1,
}

module.exports = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		host,
		messageid,
		tier,
		timestamp,
		userid,
		username,
	} = {
		...defaults,
		...args,
	}

	return {
		'badge-info': ['subscriber/0'],
		badges: ['subscriber/0'],
		'display-name': username,
		color: color,
		emotes: null,
		flags: null,
		id: messageid,
		login: username,
		mod: 0,
		'msg-id': 'primepaidupgrade',
		'msg-param-sub-plan': 1000 * tier,
		'msg-param-sub-plan-name': `Tier ${tier}`,
		'room-id': channelid,
		subscriber: 1,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		'system-msg': `${username} converted from a Twitch Prime sub to a Tier ${tier} sub!`,
		message: `${host} USERNOTICE #${channel}`,
	}
}

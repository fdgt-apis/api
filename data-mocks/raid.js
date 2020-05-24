// Module imports
const faker = require('faker')





const defaults = {
	viewercount: 10,
}

module.exports = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		host,
		messageid,
		timestamp,
		userid,
		username,
		viewercount,
	} = {
		...defaults,
		...args,
	}

	return {
		'badge-info': [],
		badges: [],
		color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		login: username,
		mod: 0,
		'msg-id': 'raid',
		'msg-param-displayName': username,
		'msg-param-login': username,
		'msg-param-profileImageURL': `https://api.adorable.io/avatars/256/${username}.png`,
		'msg-param-viewerCount': viewercount,
		'room-id': channelid,
		subscriber: 0,
		'system-msg': `${viewercount} raiders from ${username} have joined!`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${host} USERNOTICE #${channel}`,
	}
}

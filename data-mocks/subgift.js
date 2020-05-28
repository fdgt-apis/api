// Module imports
import faker from 'faker'





export const defaults = {
	tier: 1,
}

export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		host,
		messageid,
		tier,
		timestamp,
		userid,
		userid2,
		username,
		username2 = faker.internet.userName(),
	} = {
		...defaults,
		...args,
	}

	return {
		'badge-info': ['subscriber/0'],
		badges: [
			'subscriber/0',
			'sub-gifter/1'
		],
		color: color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		login: username,
		mod: 0,
		'msg-id': 'subgift',
		'msg-param-months': 0,
		'msg-param-recipient-display-name': username2,
		'msg-param-recipient-id': userid2,
		'msg-param-recipient-user-name': username2,
		'msg-param-sender-count': '1',
		'msg-param-sub-plan-name': `Tier ${tier}`,
		'msg-param-sub-plan': 1000 * tier,
		'room-id': channelid,
		'system-msg': `${username} gifted a Tier ${tier} sub to ${username2}! They have given 1 Gift Sub in the channel!`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${host} USERNOTICE #${channel}`,
	}
}

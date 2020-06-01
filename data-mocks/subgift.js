// Module imports
import faker from 'faker'





export const defaults = {
	tier: 1,
}

/**
 * `subgift` events are fired when a user gifts a subscription to another user in the channel.
 *
 * @alias `subgift`
 *
 * @param {number} tier=1 - The tier of the subscription being extended.
 * @param {string} userid2 - The ID of the user that is gifting the sub.
 * @param {string} username2 - The username of the user that is gifting the sub.
 *
 * @example <caption>Fires a `subgift` event</caption>
 * subgift
 *
 * @example <caption>Simulates a Tier 3 `subgift` event from glEnd2</caption>
 * subgift --tier 3 --username glEnd2
 */
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

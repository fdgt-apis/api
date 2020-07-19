// Module imports
import faker from 'faker'





// Local constants
const { HOST } = process.env





export const defaults = {
	count: 1,
	months: 1,
	tenure: 1,
	tier: 1,
}

/**
 * `subgift` events are fired when a user gifts a subscription to another user in the channel.
 *
 * @alias `subgift`
 *
 * @param {string} channel - The name of the channel the message will be sent to.
 * @param {string} channelid - The ID of the channel the message will be sent to.
 * @param {string} color - The color of the user's name in chat.
 * @param {string} count=1 - The total number of gifts the user has given in the channel.
 * @param {string} messageid - The ID of the message.
 * @param {number} months=1 - The length of the gift sub (for multi-month subs only).
 * @param {number} tenure=1 - The total number of months the recipient has been subscribed.
 * @param {number} tier=1 - The tier of the subscription being extended.
 * @param {string} timestamp - The millisecond timestamp when the message was sent.
 * @param {string} userid2 - The ID of the user that is receiving the sub.
 * @param {string} username2 - The username of the user that is receiving the sub.
 * @param {string} userid - The ID of the user sending the message.
 * @param {string} username - The username of the user sending the message.
 *
 * @example @lang off <caption>Fires a `subgift` event</caption>
 * subgift
 *
 * @example @lang off <caption>Simulates a Tier 3 `subgift` event from glEnd2</caption>
 * subgift --tier 3 --username glEnd2
 */
export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		count,
		messageid,
		months,
		tenure,
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

	const response = {
		'badge-info': ['subscriber/0'],
		badges: [
			'subscriber/0',
			'sub-gifter/1',
		],
		color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		login: username,
		mod: 0,
		'msg-id': 'subgift',
		'msg-param-months': Math.max(tenure, 1),
		'msg-param-recipient-display-name': username2,
		'msg-param-recipient-id': userid2,
		'msg-param-recipient-user-name': username2,
		'msg-param-sender-count': count,
		'msg-param-sub-plan-name': `Tier ${tier}`,
		'msg-param-sub-plan': 1000 * tier,
		'room-id': channelid,
		'system-msg': `${username} gifted a Tier ${tier} sub to ${username2}! They have given ${count} Gift Sub${count > 1 ? 's' : ''} in the channel!`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${HOST} USERNOTICE #${channel}`,
	}

	if (months > 1) {
		response['msg-params-gift-months'] = months
	}

	return response
}

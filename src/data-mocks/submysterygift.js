// Local constants
const { HOST } = process.env





export const defaults = {
	count: 5,
	tier: 1,
}

/**
 * `submysterygift` events are fired when a user gives mystery subscription gifts.
 *
 * @alias `submysterygift`
 *
 * @param {string} color - The color of the user's name in chat.
 * @param {number} count=5 - The number of gifts the user is currently giving in the channel.
 * @param {string} messageid - The ID of the message.
 * @param {string} timestamp - The millisecond timestamp when the message was sent.
 * @param {number} totalcount=5 The total number of gifts the user has given in the channel.
 * @param {string} userid - The ID of the user sending the message.
 * @param {string} username - The username of the user sending the message.
 *
 * @example @lang off <caption>Fires a `submysterygift` event</caption>
 * submysterygift
 *
 * @example @lang off <caption>Simulates zebiniasis giving 20 mystery sub gifts</caption>
 * submysterygift --count 20 --username zebiniasis
 */
export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		count,
		messageid,
		tier,
		timestamp,
		totalcount,
		userid,
		username,
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
		color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		login: username,
		mod: 0,
		'msg-id': 'submysterygift',
		'msg-param-mass-gift-count': count,
		'msg-param-sender-count': totalcount || count,
		'msg-param-sub-plan-name': `Tier ${tier}`,
		'msg-param-sub-plan': 1000 * tier,
		'room-id': channelid,
		subscriber: 1,
		'system-msg': `${username} is gifting ${count} Tier ${tier} Subs to the community! They've gifted a total of ${totalcount || count} in the channel!`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${HOST} USERNOTICE #${channel}`,
	}
}

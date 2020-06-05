export const defaults = {
	tier: 1,
}

/**
 * `primepaidupgrade` events are fired when a user upgrades from a Prime subscription to a paid subscription.
 *
 * @alias `primepaidupgrade`
 *
 * @param {string} channel - The name of the channel the message will be sent to.
 * @param {string} channelid - The ID of the channel the message will be sent to.
 * @param {string} color - The color of the user's name in chat.
 * @param {string} messageid - The ID of the message.
 * @param {number} tier=1 - The tier of the subscription being upgraded to.
 * @param {string} timestamp - The millisecond timestamp when the message was sent.
 * @param {string} userid - The ID of the user sending the message.
 * @param {string} username - The username of the user sending the message.
 *
 * @example @lang off <caption>Fires a `primepaidupgrade` event</caption>
 * primepaidupgrade
 *
 * @example @lang off <caption>Fires a `primepaidupgrade` event with the user upgrading to Tier 3</caption>
 * primepaidupgrade --tier 3
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
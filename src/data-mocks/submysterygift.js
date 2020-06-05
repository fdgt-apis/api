export const defaults = {
	giftcount: 5,
}

/**
 * `submysterygift` events are fired when a user gives mystery subscription gifts.
 *
 * @alias `submysterygift`
 *
 * @param {string} channel - The name of the channel the message will be sent to.
 * @param {string} channelid - The ID of the channel the message will be sent to.
 * @param {string} color - The color of the user's name in chat.
 * @param {number} giftcount=5 - The tier of the subscription being extended.
 * @param {string} messageid - The ID of the message.
 * @param {string} timestamp - The millisecond timestamp when the message was sent.
 * @param {number} totalgiftcount=5 The total number of gifts the user has given in the channel.
 * @param {string} userid - The ID of the user sending the message.
 * @param {string} username - The username of the user sending the message.
 *
 * @example @lang off <caption>Fires a `submysterygift` event</caption>
 * submysterygift
 *
 * @example @lang off <caption>Simulates zebiniasis giving 20 mystery sub gifts</caption>
 * submysterygift --giftcount 20 --username zebiniasis
 */
export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		giftcount,
		host,
		messageid,
		tier,
		timestamp,
		totalgiftcount,
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
		'msg-param-mass-gift-count': giftcount,
		'msg-param-sender-count': totalgiftcount || giftcount,
		'msg-param-sub-plan-name': `Tier ${tier}`,
		'msg-param-sub-plan': 1000 * tier,
		'room-id': channelid,
		subscriber: 1,
		'system-msg': `${username} is gifting ${giftcount} Tier ${tier} Subs to the community! They've gifted a total of ${totalgiftcount || giftcount} in the channel!`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${host} USERNOTICE #${channel}`,
	}
}

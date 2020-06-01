export const defaults = {
	giftcount: 5,
}

/**
 * `submysterygift` events are fired when a user gives mystery subscription gifts.
 *
 * @alias `submysterygift`
 *
 * @param {number} giftcount=5 - The tier of the subscription being extended.
 * @param {number} totalgiftcount=5 The total number of gifts the user has given in the channel.
 *
 * @example <caption>Fires a `submysterygift` event</caption>
 * submysterygift
 *
 * @example <caption>Simulates zebiniasis giving 20 mystery sub gifts</caption>
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

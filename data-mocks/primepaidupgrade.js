export const defaults = {
	tier: 1,
}

/**
 * `primepaidupgrade` events are fired when a user upgrades from a Prime subscription to a paid subscription.
 *
 * @alias `primepaidupgrade`
 *
 * @param {number} tier=1 - The tier of the subscription being upgraded to.
 *
 * @example <caption>Fires a `primepaidupgrade` event</caption>
 * primepaidupgrade
 *
 * @example <caption>Fires a `primepaidupgrade` event with the user upgrading to Tier 3</caption>
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

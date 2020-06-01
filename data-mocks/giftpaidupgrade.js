// Module imports
import faker from 'faker'





export const defaults = {
	months: 3,
}

/**
 * `giftpaidupgrade` events are fired when a user upgrades their subscription from one that was previously gifted to them.
 *
 * @alias `giftpaidupgrade`
 *
 * @param {number} months=3 - The number of months the subscription has been active.
 * @param {string} username2 - The username of the user that originally gifted the sub.
 *
 * @example <caption>Fires an `giftpaidupgrade` event</caption>
 * giftpaidupgrade
 *
 * @example <caption>Fires an `giftpaidupgrade` event for a user that's been gifted subs for the past 12 months</caption>
 * giftpaidupgrade --months 3
 */
export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		host,
		messageid,
		months,
		timestamp,
		userid,
		username,
		username2 = faker.internet.userName(),
	} = {
		...defaults,
		...args,
	}

	return {
		'badge-info': [`subscriber/${months}`],
		badges: [`subscriber/${months}`],
		color: color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		login: username,
		mod: 0,
		'msg-id': 'giftpaidupgrade',
		'msg-param-sender-login': username2,
		'msg-param-sender-name': username2,
		'room-id': channelid,
		subscriber: 1,
		'system-msg': `${username} is continuing the Gift Sub they got from ${username2}!`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${host} USERNOTICE #${channel}`,
	}
}

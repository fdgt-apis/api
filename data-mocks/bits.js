export const defaults = {
	bitscount: 100,
}

/**
 * `bits` events are fired when a user sends a message to a Twitch channel that contains [`bits`](https://help.twitch.tv/s/article/guide-to-cheering-with-bits).
 *
 * @alias `bits`message
 *
 * @param {number} bitscount=100 The number of bits to attach to the message.
 * @param {string} message The body of the message.
 *
 * @example <caption>Fires a `bits` event with no message</caption>
 * bits
 *
 * @example <caption>Fires a `bits` event with a custom amount of bits and the message "Woohoo!"</caption>
 * bits --bitscount 999999 Woohoo!
 */
export const render = (args = {}) => {
	const {
		bitscount,
		color,
		channel,
		channelid,
		host,
		message,
		messageid,
		timestamp,
		userid,
		username,
	} = {
		...defaults,
		...args,
	}

	return {
		'badge-info': [],
		badges: [],
		bits: bitscount,
		color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		mod: 0,
		'room-id': channelid,
		subscriber: 0,
		'tmi-sent-ts': timestamp,
		turbo: 0,
		'user-id': userid,
		'user-type': null,
		message: `${username}!${username}@${username}.${host} PRIVMSG #${channel} :${message}`,
	}
}

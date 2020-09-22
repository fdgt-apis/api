// Module imports
import faker from 'faker'





// Local imports
import { incrementStat } from 'helpers/updateStat'





// Local constants
const { HOST } = process.env





export const defaults = {
	viewercount: 10,
}

/**
 * `raid` events are fired when a channel is raided by another stream.
 *
 * @alias `raid`
 *
 * @param {string} color - The color of the user's name in chat.
 * @param {string} messageid - The ID of the message.
 * @param {string} timestamp - The millisecond timestamp when the message was sent.
 * @param {string} userid - The ID of the user sending the message.
 * @param {string} username The channel the raid is coming from.
 * @param {number} viewercount=10 The number of viewers that joined the raid.
 *
 * @example @lang off <caption>Fires a `raid` event</caption>
 * raid
 *
 * @example @lang off <caption>Simulates a `raid` from Dr. Disrespect with 10,000 viewers</caption>
 * raid --username drdisrespectlive --viewercount 10000
 */
export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		messageid,
		timestamp,
		userid,
		username,
		viewercount,
	} = {
		...defaults,
		...args,
	}

	incrementStat('events/raid')

	return {
		'badge-info': [],
		badges: [],
		color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		login: username,
		mod: 0,
		'msg-id': 'raid',
		'msg-param-displayName': username,
		'msg-param-login': username,
		'msg-param-profileImageURL': `https://api.adorable.io/avatars/256/${username}.png`,
		'msg-param-viewerCount': viewercount,
		'room-id': channelid,
		subscriber: 0,
		'system-msg': `${viewercount} raiders from ${username} have joined!`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${HOST} USERNOTICE #${channel}`,
	}
}

// Local imports
import { DOLLARBUCK_CORRELATIONS } from 'data/DOLLARBUCK_CORRELATIONS'
import { incrementStat } from 'helpers/incrementStat'





// Local constants
const { HOST } = process.env





export const defaults = {
	prime: false,
	tier: 1,
}

/**
 * `subscription` events are fired when a user subscribes to a channel for the first time.
 *
 * @alias `subscription`
 *
 * @param {string} color - The color of the user's name in chat.
 * @param {string} messageid - The ID of the message.
 * @param {boolean} prime=false Whether this is a Prime subscription.
 * @param {number} tier=1 - The tier of the subscription being extended.
 * @param {string} timestamp - The millisecond timestamp when the message was sent.
 * @param {string} userid - The ID of the user sending the message.
 * @param {string} username - The username of the user sending the message.
 *
 * @example @lang off <caption>Fires a `subscription` event</caption>
 * subscription
 *
 * @example @lang off <caption>Simulates a Prime `subscription` event</caption>
 * subscription --prime
 *
 * @example @lang off <caption>Simulates a Tier 3 `subscription` event</caption>
 * subscription --tier 3
 */
export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		messageid,
		prime,
		tier,
		timestamp,
		userid,
		username,
	} = {
		...defaults,
		...args,
	}

	const plan = prime ? 'Prime' : (1000 * tier)
	const planName = prime ? 'Prime' : `Tier ${tier}`

	incrementStat('subs')
	incrementStat('event/sub')
	incrementStat('dollarbucksSaved', DOLLARBUCK_CORRELATIONS['subscription'][tier])

	return {
		'badge-info': [
			'subscriber/0',
			'premium/1'
		],
		badges: [
			'subscriber/0',
			'premium/1'
		],
		color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		login: username,
		mod: 0,
		'msg-id': 'sub',
		'msg-param-cumulative-months': 1,
		'msg-param-months': 0,
		'msg-param-should-share-streak': 0,
		'msg-param-sub-plan-name': planName,
		'msg-param-sub-plan': plan,
		'room-id': channelid,
		subscriber: 1,
		'system-msg': `${username} subscribed at ${planName}.`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${HOST} USERNOTICE #${channel}`,
	}
}

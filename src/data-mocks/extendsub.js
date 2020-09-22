// Module imports
import moment from 'moment'





// Local imports
import { DOLLARBUCK_CORRELATIONS } from 'data/DOLLARBUCK_CORRELATIONS'
import { incrementStat } from 'helpers/updateStat'





// Local constants
const { HOST } = process.env





export const defaults = {
	months: 3,
	tier: 1,
}

/**
 * `extendsub` events are fired when a user extends their existing non-gifted subscription to a Twitch channel.
 *
 * @alias `extendsub`
 *
 * @param {string} color - The color of the user's name in chat.
 * @param {string} messageid - The ID of the message.
 * @param {number} months=3 - The number of months the subscription is being extended.
 * @param {string} timestamp - The millisecond timestamp when the message was sent.
 * @param {string} userid - The ID of the user sending the message.
 * @param {string} username - The username of the user sending the message.
 * @param {number} tier=1 - The tier of the subscription being extended.
 *
 * @example @lang off <caption>Fires an `extendsub` event</caption>
 * 'extendsub'
 *
 * @example @lang off <caption>Fires an `extendsub` event to extend the user's subscription by 6 months</caption>
 * extendsub --months 6
 *
 * @example @lang off <caption>Fires an `extendsub` event for a Tier 3 subscription</caption>
 * extendsub --tier 3
 */
export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		messageid,
		months,
		tier,
		timestamp,
		userid,
		username,
	} = {
		...defaults,
		...args,
	}
	const timeAsMoment = moment(timestamp)

	const endmonth = timeAsMoment.add(months, 'months').month()
	const endmonthname = timeAsMoment.format('MMMM')

	incrementStat('events/extendsub')
	incrementStat('dollarbucksSaved', DOLLARBUCK_CORRELATIONS['subscription'][tier])

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
		'msg-id': 'extendsub',
		'msg-param-cumulative-months': months,
		'msg-param-sub-benefit-end-month': endmonth,
		'msg-param-sub-plan-name': `Tier ${tier}`,
		'msg-param-sub-plan': 1000 * tier,
		'room-id': channelid,
		subscriber: 1,
		'system-msg': `${username} extended their Tier ${tier} subscription through ${endmonthname}!`,
		'tmi-sent-ts': timestamp,
		'user-id': userid,
		'user-type': null,
		message: `${HOST} USERNOTICE #${channel}`,
	}
}

// Local imports
import { incrementStat } from 'helpers/updateStat'





// Local constants
const { HOST } = process.env





export const defaults = {
	off: false,
}

/**
 * `subsonly` events are fired when a Twitch channel is switched into `subs-only mode`.
 *
 * **NOTE:** This will not actually set the channel to subs-only mode on `fdgt`. It only simulates the event of changing a channel's subs-only mode status.
 *
 * **NOTE:** This event **does not support all global parameters**. The table below is an exhaustive list of the supported parameters for this event.
 *
 * @alias `subsonly`
 *
 * @param {boolean} off=false - Whether emote-only mode is being enabled or disabled.
 *
 * @example @lang off <caption>Fires an `subsonly` event, enabling slow mode on the channel.</caption>
 * subsonly
 *
 * @example @lang off <caption>Fires an `subsonly` event, disabling slow mode on the channel.</caption>
 * subsonly --off
 */
export const render = (args = {}) => {
	const {
		channel: channelName,
		connection,
		off,
	} = {
		...defaults,
		...args,
	}

	const channel = connection.channels.findByName(channelName)

	channel.subsOnly = !off

	incrementStat('events/subsonly')

	return {
		message: `${HOST} NOTICE #${channelName} :This room is ${off ? 'no longer' : 'now'} in subscribers-only mode.`,
		'msg-id': `subs_${off ? 'off' : 'on'}`,
	}
}

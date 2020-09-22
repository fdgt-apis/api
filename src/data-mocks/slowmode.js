// Local imports
import { incrementStat } from 'helpers/updateStat'





// Local constants
const { HOST } = process.env





export const defaults = {
	off: false,
}

/**
 * `slowmode` events are fired when a Twitch channel is switched into `slow mode`.
 *
 * **NOTE:** This will not actually set the channel to slow mode on `fdgt`. It only simulates the event of changing a channel's slow mode status.
 *
 * **NOTE:** This event **does not support all global parameters**. The table below is an exhaustive list of the supported parameters for this event.
 *
 * @alias `slowmode`
 *
 * @param {boolean} off=false - Whether emote-only mode is being enabled or disabled.
 *
 * @example @lang off <caption>Fires an `slowmode` event, enabling slow mode on the channel.</caption>
 * slowmode
 *
 * @example @lang off <caption>Fires an `slowmode` event, disabling slow mode on the channel.</caption>
 * slowmode --off
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

	channel.slowMode = !off

	incrementStat('event/slowmode')

	return {
		message: `${HOST} NOTICE #${channelName} :This room is ${off ? 'no longer' : 'now'} in slow mode.${off ? '' : ' You can send messages every 30 seconds.'}`,
		'msg-id': `slow_${off ? 'off' : 'on'}`,
	}
}

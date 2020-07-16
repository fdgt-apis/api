// Local constants
const { HOST } = process.env





export const defaults = {
	off: false,
}

/**
 * `emoteonly` events are fired when a Twitch channel is switched into `emote-only mode`.
 *
 * **NOTE:** This will not prevent non-emote only messages from being sent on `fdgt`. It only simulates the event of changing a channel's emote-only status.
 *
 * **NOTE:** This event **does not support all global parameters**. The table below is an exhaustive list of the supported parameters for this event.
 *
 * @alias `emoteonly`
 *
 * @param {string} channel - The name of the channel (no `#`) that will be set to emote-only mode.
 * @param {boolean} off=false - Whether emote-only mode is being enabled or disabled.
 *
 * @example @lang off <caption>Fires an `emoteonly` event, enabling emote-only mode on the channel.</caption>
 * emoteonly
 *
 * @example @lang off <caption>Fires an `emoteonly` event, disabling emote-only mode on the channel.</caption>
 * emoteonly --off
 */
export const render = (args = {}) => {
	const {
		channel,
		off,
	} = {
		...defaults,
		...args,
	}

	channel.emoteOnly = !off

	return {
		message: `${HOST} NOTICE #${channel} :This room is ${off ? 'no longer' : 'now'} in emote-only mode.`,
		'msg-id': `emote_only_${off ? 'off' : 'on'}`,
	}
}

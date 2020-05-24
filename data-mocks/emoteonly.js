const defaults = {
	off: false,
	on: true,
}

module.exports = (args = {}) => {
	const {
		channel,
		host,
		off,
		on,
	} = {
		...defaults,
		...args,
	}

	channel.emoteOnly = !off

	return {
		message: `${host} NOTICE #${channel} :This room is ${off ? 'no longer' : 'now'} in emote-only mode.`,
		'msg-id': `emote_only_${off ? 'off' : 'on'}`,
	}
}

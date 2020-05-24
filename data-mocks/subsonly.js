const defaults = {
	off: false,
}

module.exports = (args = {}) => {
	const {
		channel,
		host,
		off,
	} = {
		...defaults,
		...args,
	}

	channel.subsOnly = !off

	return {
		message: `${host} NOTICE #${channel} :This room is ${off ? 'no longer' : 'now'} in subscribers-only mode.`,
		'msg-id': `subs_${off ? 'off' : 'on'}`,
	}
}

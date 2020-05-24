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

	channel.slowMode = !off

	return {
		message: `${host} NOTICE #${channel} :This room is ${off ? 'no longer' : 'now'} in slow mode.${off ? '' : ' You can send messages every 30 seconds.'}`,
		'msg-id': `slow_${off ? 'off' : 'on'}`,
	}
}

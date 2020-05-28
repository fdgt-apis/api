// Module imports
import moment from 'moment'





export const defaults = {
	months: 3,
	tier: 1,
}

export const render = (args = {}) => {
	const {
		channel,
		channelid,
		color,
		host,
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
		message: `${host} USERNOTICE #${channel}`,
	}
}

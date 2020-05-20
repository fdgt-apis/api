// Module imports
const { v4: uuid } = require('uuid')
const moment = require('moment')





// Local constants
const { HOST } = process.env





module.exports = options => {
	const {
		args,
		channel,
		template,
		user,
	} = options
	const parameters = {
		bitscount: 100,
		channel: channel?.name,
		channelid: channel?.id,
		color: user?.color,
		giftcount: 5,
		host: HOST,
		messageid: uuid(),
		months: 3,
		timestamp: Date.now(),
		userid: user?.id,
		username: user?.username,
		viewercount: 10,
		...args,
	}
	const response = {}

	const timeAsMoment = moment(parameters.timestamp)

	parameters.endmonth = timeAsMoment.month() + parameters.months
	parameters.endmonthname = timeAsMoment.format('MMMM')

	if (!parameters.totalgiftcount) {
		parameters.totalgiftcount = parameters.giftcount
	}

	const renderedTemplate = Object.entries(template).reduce((accumulator, [key, value]) => {
		if (Array.isArray(value)) {
			value = value.join(',')
		}

		if (typeof value === 'string') {
			accumulator[key] = value.replace(/(?:<(\w+)>)/gu, (match, replacementKey) => {
				if (parameters[replacementKey] || typeof parameters[replacementKey] === 'string') {
					return parameters[replacementKey]
				}

				return match
			})
		} else if (parameters[key]) {
			accumulator[key] = parameters[key]
		}

		return accumulator
	}, { ...template })

	response.message = renderedTemplate.message || ''
	response.tags = renderedTemplate

	delete renderedTemplate.message

	return response
}

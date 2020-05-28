// Module imports
import { v4 as uuid } from 'uuid'





// Local constants
const { HOST } = process.env





export default options => {
	const messageID = uuid()
	const {
		args = {},
		channel,
		template,
		user,
	} = options
	const parameters = {
		channel: channel?.name,
		channelid: channel?.id,
		color: user?.color,
		host: HOST,
		id: messageID,
		messageid: messageID,
		timestamp: Date.now(),
		userid: user?.id,
		username: user?.username,
		...args,
	}
	const response = {}

	const renderedTemplate = template(parameters)

	response.message = renderedTemplate.message || ''
	response.tags = renderedTemplate

	delete renderedTemplate.message

	return response
}

// Local imports
const getMock = require('../helpers/getMock')
const renderMessage = require('../helpers/renderMessage')





module.exports = options => {
	const {
		args,
		channel,
		command,
		user,
	} = options

	try {
		return renderMessage({
			args,
			channel,
			command,
			template: getMock({ command }),
			user,
		})
	} catch (error) {
		return null
	}
}

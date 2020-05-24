// Local imports
const renderTemplate = require('../helpers/renderTemplate')
const serializeTwitchObject = require('../helpers/serializeTwitchObject')





module.exports = options => {
	const {
		args,
		channel,
		template,
		user,
	} = options

	try {
		const renderedTemplate = renderTemplate({
			args,
			channel,
			template,
			user,
		})
		return `@${serializeTwitchObject(renderedTemplate.tags)} :${renderedTemplate.message}`
	} catch (error) {
		return null
	}
}

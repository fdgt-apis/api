// Local imports
import renderTemplate from 'helpers/renderTemplate'
import serializeTwitchObject from 'helpers/serializeTwitchObject'





export default options => {
	const {
		args,
		channel,
		connection,
		template,
		user,
	} = options

	try {
		const renderedTemplate = renderTemplate({
			args,
			channel,
			connection,
			template,
			user,
		})
		return `@${serializeTwitchObject(renderedTemplate.tags)} :${renderedTemplate.message}`
	} catch (error) {
		return null
	}
}

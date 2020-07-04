// Local imports
import renderTemplate from 'helpers/renderTemplate'
import serializeTwitchObject from 'helpers/serializeTwitchObject'





export default options => {
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

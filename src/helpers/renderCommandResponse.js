// Local imports
import getMock from 'helpers/getMock'
import renderMessage from 'helpers/renderMessage'





export default options => {
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

// Module imports
const path = require('path')





// Local constants
const mocksPath = path.resolve(__dirname, '..', 'data-mocks')





module.exports = options => {
	const { command } = options

	try {
		return require(path.resolve(mocksPath, `${command}.js`))
	} catch (error) {
		return null
	}
}

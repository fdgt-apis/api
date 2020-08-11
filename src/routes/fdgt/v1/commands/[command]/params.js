// Module imports
import { promisify } from 'util'
import fs from 'fs'
import jsdoc from 'jsdoc-api'
import path from 'path'





// Local imports
import Route from 'structures/Route'





// Local constants
const isDev = process.env.NODE_ENV !== 'production'
const readFile = promisify(fs.readFile)
const sourceDirectory = path.resolve(process.cwd(), (isDev ? 'src' : 'dist'))





export const route = new Route({
	handler: async context => {
		const { command } = context.params

		try {
			const commandPath = path.resolve(sourceDirectory, 'data-mocks', `${command}.js`)
			const fileContents = await readFile(commandPath, 'utf8')
			const explainer = await jsdoc.explain({ source: fileContents })
			const params = explainer.find(item => item.name === `\`${command}\``).params.map(param => ({
				description: param.description,
				name: param.name,
				types: param.type.names,
			}))

			context.data = params
		} catch (error) {
			context.errors.push(error.message)
		}
	},
	route: '/fdgt/v1/commands/:command/params',
})

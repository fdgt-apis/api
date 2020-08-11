// Module imports
import { promisify } from 'util'
import jsdoc2md from 'jsdoc-to-markdown'
import path from 'path'





// Local imports
import Route from 'structures/Route'





// Local constants
const isDev = process.env.NODE_ENV !== 'production'
const sourceDirectory = path.resolve(process.cwd(), (isDev ? 'src' : 'dist'))





export const route = new Route({
	handler: async context => {
		const { command } = context.params

		try {
			const commandPath = path.resolve(sourceDirectory, 'data-mocks', `${command}.js`)
			const jsdocHelpersPath = path.resolve(sourceDirectory, 'helpers', 'jsdocHelpers')
			const jsdocPartialsPath = path.resolve(sourceDirectory, 'helpers', 'jsdocPartials')

			const doc = await jsdoc2md.render({
				files: commandPath,
				'heading-depth': 1,
				helper: [
					path.resolve(jsdocHelpersPath, 'firstLine.js'),
				],
				partial: [
					path.resolve(jsdocPartialsPath, 'docs.hbs'),
					path.resolve(jsdocPartialsPath, 'examples.hbs'),
					path.resolve(jsdocPartialsPath, 'params.hbs'),
				],
			})

			context.data = doc
		} catch (error) {
			context.errors.push(error.message)
		}
	},
	route: '/fdgt/v1/commands/:command/docs',
})

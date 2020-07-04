// Module imports
import { promisify } from 'util'
import frontmatter from 'frontmatter'
import fs from 'fs'
import jsdoc2md from 'jsdoc-to-markdown'
import path from 'path'





// Local imports
import Route from 'structures/Route'





// Local constants
const readFile = promisify(fs.readFile)





export const route = new Route({
	handler: async context => {
		const { command } = context.params

		try {
			const commandPath = path.resolve(__dirname, '..', '..', '..', '..', 'data-mocks', `${command}.js`)
			const jsdocHelpersPath = path.resolve(__dirname, '..', '..', '..', '..', 'helpers', 'jsdocHelpers')
			const jsdocPartialsPath = path.resolve(__dirname, '..', '..', '..', '..', 'helpers', 'jsdocPartials')

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

			const {
				data,
				content,
			} = frontmatter(doc)

			context.data = {
				...data,
				content,
			}
		} catch (error) {
			context.errors.push(error.message)
		}
	},
	route: '/fdgt/v1/commands/:command',
})

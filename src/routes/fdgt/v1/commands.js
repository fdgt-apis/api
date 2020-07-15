// Module imports
import { promisify } from 'util'
import fs from 'fs'
import jsdoc from 'jsdoc-api'
import path from 'path'





// Local imports
import Route from 'structures/Route'





// Local constants
const isDev = process.env.NODE_ENV !== 'production'
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const sourceDirectory = path.resolve(process.cwd(), (isDev ? 'src' : 'dist'))





export const route = new Route({
	handler: async context => {
		try {
			const commandsPath = path.resolve(sourceDirectory, 'data-mocks')
			const dataMockFiles = await readdir(commandsPath)
			const commands = dataMockFiles.map(filename => filename.replace(/\.js$/, ''))

			if (context.query.includeParams) {
				const params = await Promise.all(commands.map(command => {
					const commandPath = path.resolve(commandsPath, `${command}.js`)

					return readFile(commandPath, 'utf8')
						.then(source => jsdoc.explain({ source }))
						.then(explainer => {
							return explainer
								.find(item => item.name === `\`${command}\``)
								.params
								.map(param => ({
									description: param.description,
									name: param.name,
									types: param.type.names,
								}))
						})
				}))

				context.data = commands.reduce((accumulator, command, index) => {
					accumulator[command] = params[index]
					return accumulator
				}, {})
			} else {
				context.data = commands
			}
		} catch (error) {
			context.errors.push(error.message)
		}
	},
	route: '/fdgt/v1/commands',
})

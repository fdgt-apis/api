// Module imports
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'





// Local imports
import Route from 'structures/Route'





// Local constants
const readdir = promisify(fs.readdir)





export const route = new Route({
	handler: async context => {
		try {
			const commandsPath = path.resolve(__dirname, '..', '..', '..', 'data-mocks')
			const dataMockFiles = await readdir(commandsPath)
			context.data = dataMockFiles.map(filename => filename.replace(/\.js$/, ''))
		} catch (error) {
			context.errors.push(error.message)
		}
	},
	route: '/fdgt/v1/commands',
})

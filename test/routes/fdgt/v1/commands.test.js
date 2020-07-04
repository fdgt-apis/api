// Module imports
import {
	expect,
	request,
} from 'chai'
import fs from 'fs'
import Koa from 'koa'
import path from 'path'





// Local imports
import API from 'structures/API'





// Local constants
const url = '/fdgt/v1/commands'





describe(url, function () {
	this.slow(400)

	const commandsPath = path.resolve(process.cwd(), 'src', 'data-mocks')
	const commandFilenames = fs.readdirSync(commandsPath)
	const commands = commandFilenames.map(filename => filename.replace(/\.js$/, ''))
	let requester = null

	beforeEach(() => {
		requester = request(API.callback()).keepOpen()
	})

	afterEach(() => {
		requester.close()
	})

	it('should complete successfully', async () => {
		const response = await requester.get(url)

		expect(response).to.have.status(200)
		expect(response).to.be.json
	})

	it('should return the list of commands', async () => {
		const response = await requester.get(url)

		expect(response.body.data).to.have.members(commands)
	})
})

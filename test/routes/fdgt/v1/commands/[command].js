// Module imports
import {
	expect,
	request,
} from 'chai'
import frontmatter from 'frontmatter'
import fs from 'fs'
import jsdoc2md from 'jsdoc-to-markdown'
import Koa from 'koa'
import path from 'path'





// Local imports
import API from 'structures/API'





// Local constants
const url = '/fdgt/v1/commands/:command'





describe(url, () => {
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

	commands.forEach(command => {
		describe(command, () => {
			const commandURL = url.replace(/:command$/, command)
			const commandPath = path.resolve(commandsPath, `${command}.js`)
			const jsdocHelpersPath = path.resolve(process.cwd(), 'src', 'helpers', 'jsdocHelpers')
			const jsdocPartialsPath = path.resolve(process.cwd(), 'src', 'helpers', 'jsdocPartials')

			let doc = null
			let docData = null

			before(async () => {
				doc = await jsdoc2md.render({
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

				docData = frontmatter(doc)
			})

			it('should complete successfully', async () => {
				const response = await requester.get(commandURL)

				expect(response).to.have.status(200)
				expect(response).to.be.json
			})


			describe('frontmatter', () => {
				it('should have a title', async () => {
					const { body } = await requester.get(commandURL)
					const parsedFrontmatter = frontmatter(body.data)

					expect(parsedFrontmatter.data.title).to.equal(docData.data.title)
				})

				it('should have a description', async () => {
					const { body } = await requester.get(commandURL)
					const parsedFrontmatter = frontmatter(body.data)

					expect(parsedFrontmatter.data.description).to.equal(docData.data.description)
				})
			})

			it('should return docs', async () => {
				const { body } = await requester.get(commandURL)

				expect(body.data).to.equal(doc)
			})
		})
	})
})

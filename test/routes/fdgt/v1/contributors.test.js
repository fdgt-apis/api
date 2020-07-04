// Module imports
import {
	expect,
	request,
} from 'chai'
import { promisify } from 'util'
import fs from 'fs'
import Koa from 'koa'
import path from 'path'





// Local imports
import API from 'structures/API'





// Local constants
const allContributorsPath = path.resolve(process.cwd(), '.all-contributorsrc')
const readFile = promisify(fs.readFile)
const url = '/fdgt/v1/contributors'





describe(url, function () {
	this.slow(400)

	const allContributorsFile = fs.readFileSync(allContributorsPath, 'utf8')
	const allContributors = JSON.parse(allContributorsFile)
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

	it('should return the list of contributors', async () => {
		const { body } = await requester.get(url)

		expect(body.data).to.be.an('array')
	})

	describe('contributors', () => {
		allContributors.contributors.forEach(contributor => {
			describe(contributor.name, () => {
				it('should be returned', async () => {
					const { body } = await requester.get(url)
					const matchedContributor = body.data.find(({ login }) => (login === contributor.login))

					expect(matchedContributor).to.exist
				})

				Object.entries(contributor).forEach(([key, value]) => {
					it(`should return ${key}`, async () => {
						const { body } = await requester.get(url)
						const matchedContributor = body.data.find(({ login }) => (login === contributor.login))

						if (Array.isArray(value)) {
							expect(matchedContributor[key]).to.have.members(value)
						} else {
							expect(matchedContributor[key]).to.equal(value)
						}
					})
				})
			})
		})
	})
})

// Module imports
import {
	expect,
	request,
} from 'chai'
import Koa from 'koa'





// Local imports
import API from 'structures/API'





// Local constants
const url = '/fdgt/v1/sponsors'





describe(url, function () {
	this.slow(400)

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

		expect(body.data).to.be.an('object')
	})

	it('should return the list of sponsorship tiers', async () => {
		const { body } = await requester.get(url)

		expect(body.included).to.be.an('array')
	})
})

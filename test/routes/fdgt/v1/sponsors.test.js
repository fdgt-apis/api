// Module imports
import {
	expect,
	request,
} from 'chai'
import Koa from 'koa'
import nock from 'nock'





// Local imports
import API from 'structures/API'





// Local constants
const url = '/fdgt/v1/sponsors'





describe(url, function () {
	this.slow(400)

	let requester = null

	beforeEach(() => {
		const scope = nock('https://api.github.com')
			.post('/graphql')
			.reply(200, {
				data: {
					user: {
						sponsorsListing: {
							tiers: {
								nodes: [
									{
										description: 'Beep',
										id: '0',
										monthlyPriceInDollars: 7,
										name: 'Non-publicized Tier',
									},
									{
										description: 'Boop',
										id: '1',
										monthlyPriceInDollars: 7,
										name: 'Publicized Tier',
									},
								],
							},
						},
						sponsorshipsAsMaintainer: {
							nodes: [
								{
									createdAt: '2020-07-02T18:05:27Z',
									privacyLevel: 'PUBLIC',
									sponsorEntity: {
										id: '0',
									},
									tier: {
										description: 'Beep',
										id: '0',
										monthlyPriceInDollars: 7,
										name: 'Non-publicized Tier',
									},
								},
							],
						},
					},
				},
			})
		requester = request(API.callback()).keepOpen()
	})

	afterEach(() => {
		requester.close()
	})

	it('should complete successfully', async () => {
		const response = await requester.get(url)

		console.log(response)
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

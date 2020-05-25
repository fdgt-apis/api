// Module imports
const { expect } = require('chai')
const { v4: uuid } = require('uuid')
const faker = require('faker')





// Local imports
const Channel = require('../../structures/Channel')
const ChannelList = require('../../structures/ChannelList')
const dedupeArray = require('../../helpers/dedupeArray')





// Local constants
const testChannelName = 'TestChannel'





describe('ChannelList', () => {
	const randomChannelNames = dedupeArray(Array(10).fill(null).map(() => faker.hacker.noun()))
	const randomChannels = randomChannelNames.map(channelName => new Channel({ name: channelName }))

	let channel = null
	let channelList = null

	beforeEach(() => {
		channel = new Channel({ name: testChannelName })
		channelList = new ChannelList
		channelList.add(channel)
		randomChannels.forEach(randomChannel => channelList.add(randomChannel))
	})

	afterEach(() => {
		channelList.clear()
		channelList = null
		channel = null
	})

	describe('findByName', () => {
		it('should return the correct channel', () => {
			expect(channelList.findByName(testChannelName.toLowerCase())).to.equal(channel)
		})
	})

	describe('channelNames', () => {
		it('should be a list of all channel names', () => {
			expect(channelList.channelNames).to.have.members(randomChannelNames.concat(testChannelName.toLowerCase()))
		})
	})
})

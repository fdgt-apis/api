// Module imports
import { v4 as uuid } from 'uuid'
import { expect } from 'chai'
import faker from 'faker'





// Local imports
import Channel from '../../structures/Channel'
import ChannelList from '../../structures/ChannelList'
import dedupeArray from '../../helpers/dedupeArray'





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

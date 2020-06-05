// Module imports
import { v4 as uuid } from 'uuid'
import { expect } from 'chai'
import faker from 'faker'





// Local imports
import User from '../../src/structures/User'
import UserList from '../../src/structures/UserList'
import dedupeArray from '../../src/helpers/dedupeArray'





// Local constants
const testUsername = faker.internet.userName()





describe('UserList', () => {
	const randomDisplayNames = dedupeArray(Array(10).fill(null).map(() => faker.internet.userName()))
	const randomUsernames = randomDisplayNames.map(name => name.toLowerCase())
	const randomUsers = randomDisplayNames.map(displayName => new User({ username: displayName }))

	let user = null
	let userList = null

	beforeEach(() => {
		user = new User({ username: testUsername })
		userList = new UserList
		userList.add(user)
		randomUsers.forEach(randomUser => userList.add(randomUser))
	})

	afterEach(() => {
		userList.clear()
		userList = null
		user = null
	})

	describe('findByUsername', () => {
		it('should return the correct user', () => {
			expect(userList.findByUsername(testUsername.toLowerCase())).to.equal(user)
		})
	})

	describe('usernames', () => {
		it('should be a list of all usernames', () => {
			expect(userList.usernames).to.have.members(randomUsernames.concat(testUsername.toLowerCase()))
		})
	})
})

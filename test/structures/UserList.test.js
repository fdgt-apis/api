// Module imports
const { expect } = require('chai')
const { v4: uuid } = require('uuid')
const faker = require('faker')





// Local imports
const User = require('../../structures/User')
const UserList = require('../../structures/UserList')
const dedupeArray = require('../../helpers/dedupeArray')





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

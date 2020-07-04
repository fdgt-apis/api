// Module imports
import { v4 as uuid } from 'uuid'
import { expect } from 'chai'
import tinycolor from 'tinycolor2'
import validateUUID from 'uuid-validate'





// Local imports
import User from 'structures/User'





// Local constants
const username = 'Bob'





describe('User', () => {
	let user = null

	beforeEach(() => {
		user = new User({ username })
	})

	afterEach(() => {
		user = null
	})

	describe('color', () => {
		it('should be a valid color', () => {
			const color = tinycolor(user.color)
			expect(color.isValid()).to.be.true
		})
	})

	describe('id', () => {
		it('should be a valid UUID', () => {
			expect(validateUUID(user.id)).to.be.true
		})
	})

	describe('displayName', () => {
		it('should be the correct display name', () => {
			expect(user.displayName).to.be.string(username)
		})
	})

	describe('username', () => {
		it('should be the correct username', () => {
			expect(user.username).to.be.string(username.toLowerCase())
		})
	})
})

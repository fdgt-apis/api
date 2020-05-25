// Module imports
const { spy } = require('sinon')
const { expect } = require('chai')
const { v4: uuid } = require('uuid')





// Local imports
const Collection = require('../../structures/Collection')





describe('Collection', function() {
	let collection = null

	beforeEach(() => {
		collection = new Collection
		spy(collection)
	})

	afterEach(() => {
		collection = null
	})

	describe('add', () => {
		let item = 'foo'

		it('should only be called once', () => {
			collection.add(item)
			expect(collection.add.calledOnce).to.be.true
		})

		it('should be add the passed item to the collection\'s data', () => {
			collection.add(item)
			expect(collection.data).to.include(item)
		})
	})

	describe('findByID', () => {
		let itemID = uuid()
		let item = { id: itemID }

		beforeEach(() => {
			collection.add(item)
		})

		it('should only be called once', () => {
			collection.findByID(itemID)
			expect(collection.findByID.calledOnce).to.be.true
		})

		it('should return the correct item', () => {
			expect(collection.findByID(itemID)).to.equal(item)
		})
	})

	describe('findByKey', () => {
		let itemID = uuid()
		let item = { id: itemID }

		beforeEach(() => {
			collection.add(item)
		})

		it('should only be called once', () => {
			collection.findByKey('id', itemID)
			expect(collection.findByKey.calledOnce).to.be.true
		})

		it('should be a Connection', () => {
			expect(collection.findByKey('id', itemID)).to.equal(item)
		})
	})

	describe('remove', () => {
		let itemID = uuid()
		let item = { id: itemID }

		beforeEach(() => {
			collection.add(item)
		})

		it('should only be called once', () => {
			collection.remove(item)
			expect(collection.remove.calledOnce).to.be.true
		})

		it('should remove the passed item from the collection\'s data', () => {
			collection.remove(item)
			expect(collection.data).not.to.include(item)
		})
	})

	describe('isEmpty', () => {
		it('should be true if nothing has been added to the collection', () => {
			expect(collection.isEmpty).to.be.true
		})

		it('should be false if nothing has been added to the collection', () => {
			collection.add('foo')
			expect(collection.isEmpty).to.be.false
		})
	})

	describe('ids', () => {
		it('should be a list of IDs for all items in a collection', () => {
			const items = Array(3).fill(null).map(() => ({ id: uuid() }))

			items.forEach(item => collection.add(item))

			expect(collection.ids).to.include.members(items.map(({ id }) => id))
		})
	})
})

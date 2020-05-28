// Module imports
import { v4 as uuid } from 'uuid'
import { spy } from 'sinon'
import { expect } from 'chai'





// Local imports
import Collection from '../../structures/Collection'





describe('Collection', function() {
	const createItem = () => ({ id: uuid() })
	const randomItems = Array(10).fill(null).map(createItem)
	const fillCollection = () => randomItems.forEach(randomItem => collection.add(randomItem))

	let collection = null

	beforeEach(() => {
		collection = new Collection
		spy(collection)
	})

	afterEach(() => {
		collection.clear()
		collection = null
	})

	describe('add', () => {
		let item = createItem()

		it('should only be called once', () => {
			collection.add(item)
			expect(collection.add.calledOnce).to.be.true
		})

		it('should be add the passed item to the collection\'s data', () => {
			collection.add(item)
			expect(collection.data).to.include(item)
		})
	})

	describe('clear', () => {
		it('should only be called once', () => {
			collection.clear()
			expect(collection.clear.calledOnce).to.be.true
		})

		it('should remove all items from the collection', () => {
			fillCollection()
			collection.clear()
			expect(collection.isEmpty).to.be.true
		})
	})

	describe('findByID', () => {
		let item = createItem()

		beforeEach(() => {
			fillCollection()
			collection.add(item)
		})

		it('should only be called once', () => {
			collection.findByID(item.id)
			expect(collection.findByID.calledOnce).to.be.true
		})

		it('should return the correct item', () => {
			expect(collection.findByID(item.id)).to.equal(item)
		})
	})

	describe('findByKey', () => {
		let item = createItem()

		beforeEach(() => {
			fillCollection()
			collection.add(item)
		})

		it('should only be called once', () => {
			collection.findByKey('id', item.id)
			expect(collection.findByKey.calledOnce).to.be.true
		})

		it('should be a Connection', () => {
			expect(collection.findByKey('id', item.id)).to.equal(item)
		})
	})

	describe('isEmpty', () => {
		it('should be true if nothing has been added to the collection', () => {
			expect(collection.isEmpty).to.be.true
		})

		it('should be false if nothing has been added to the collection', () => {
			fillCollection()
			expect(collection.isEmpty).to.be.false
		})
	})

	describe('ids', () => {
		it('should be a list of IDs for all items in a collection', () => {
			fillCollection()
			expect(collection.ids).to.have.members(randomItems.map(({ id }) => id))
		})
	})

	describe('remove', () => {
		let itemID = uuid()
		let item = { id: itemID }

		beforeEach(() => {
			fillCollection()
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
})

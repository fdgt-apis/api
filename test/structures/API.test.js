// Module imports
import { expect } from 'chai'
import Koa from 'koa'





// Local imports
import API from 'structures/API'





describe('API', function() {
	it('should be a Koa app', () => {
		expect(API).to.be.instanceof(Koa)
	})
})

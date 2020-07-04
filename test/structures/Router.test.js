// Module imports
import { expect } from 'chai'
import KoaRouter from 'koa-router'





// Local imports
import Router from 'structures/Router'





describe('Router', function() {
	it('should be a Koa Router', () => {
		expect(Router).to.be.instanceof(KoaRouter)
	})
})

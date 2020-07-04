// Module imports
import { expect } from 'chai'





// Local imports
import Route from '../../src/structures/Route'





describe('Route', function() {
	const handler = async ctx => (ctx.body = 'boop')
	const route = '/beep'

	describe('new Route', () => {
		describe('required `options`', () => {
			it('should throw if missing `handler`', () => {
				expect(() => new Route({ route })).to.throw()
			})

			it('should throw if missing `route`', () => {
				expect(() => new Route({ handler })).to.throw()
			})
		})

		it('should store its `options`', () => {
			const { options } = new Route({
				handler,
				route,
			})
			expect(options).to.have.own.property('handler', handler)
			expect(options).to.have.own.property('route', route)
		})

		it('should use its default `options`', () => {
			const { options } = new Route({
				handler,
				route,
			})
			expect(options.methods).to.have.include('get')
		})

		it('should handle a custom `methods` list', () => {
			const methods = ['delete', 'patch', 'post', 'put']
			const { options } = new Route({
				handler,
				methods,
				route,
			})
			expect(options.methods).to.have.members(methods)
		})
	})
})

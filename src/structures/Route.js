// Local imports
import router from 'structures/Router'





export default class {
	defaultOptions = {
		methods: ['get'],
	}

	constructor (options) {
		const allOptions = {
			...this.defaultOptions,
			...options,
		}
		this.options = allOptions

		const {
			handler,
			route,
		} = allOptions

		if (!route) {
			throw new Error('route is required')
		}

		if (!handler) {
			throw new Error('handler is required')
		}

		let methods = allOptions.methods

		if (!Array.isArray(methods)) {
			methods = [methods]
		}

		methods.forEach(method => router[method](route, handler))
	}
}

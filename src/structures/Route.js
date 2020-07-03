// Local imports
import router from './Router'





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

		let methods = allOptions.methods

		if (!Array.isArray(methods)) {
			methods = [methods]
		}

		methods.forEach(method => router[method](route, handler))
	}
}

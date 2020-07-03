// Module imports
import body from 'koa-body'
import cors from '@koa/cors'
import compress from 'koa-compress'
import Koa from 'koa'
import noTrailingSlash from 'koa-no-trailing-slash'





// Local imports
import * as routes from '../routes'
import bodyBuilder from '../helpers/bodyBuilder'
import statusCodeGenerator from '../helpers/statusCodeGenerator'
import router from './Router'





// Local constants
const {
	WEB_PORT = 3000,
} = process.env





export default class {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	app = new Koa()





	/***************************************************************************\
		Private Methods
	\***************************************************************************/

	#initialize = () => {
		this.app.use(noTrailingSlash())
		this.app.use(compress())
		this.app.use(cors())
		this.app.use(body())
		this.app.use(statusCodeGenerator())
		this.app.use(bodyBuilder())

		this.app.use(router.routes())
		this.app.use(router.allowedMethods())
	}





	/***************************************************************************\
		Public Methods
	\***************************************************************************/

	constructor (options = {}) {
		this.options = options

		this.#initialize()
	}

	listen = port => this.app.listen(port)
}

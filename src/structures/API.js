// Module imports
import body from 'koa-body'
import cors from '@koa/cors'
import compress from 'koa-compress'
import Koa from 'koa'
import noTrailingSlash from 'koa-no-trailing-slash'





// Local imports
import * as routes from 'routes'
import bodyBuilder from 'helpers/bodyBuilder'
import statusCodeGenerator from 'helpers/statusCodeGenerator'
import router from 'structures/Router'





// Local constants
const {
	WEB_PORT = 3000,
} = process.env
const app = new Koa()





// Attach middlewares
app.use(noTrailingSlash())
app.use(compress())
app.use(cors())
app.use(body())
app.use(statusCodeGenerator())
app.use(bodyBuilder())

app.use(router.routes())
app.use(router.allowedMethods())





export default app

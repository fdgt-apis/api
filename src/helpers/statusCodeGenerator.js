export default () => async (context, next) => {
  await next()

  if (!context.status || (context.status === 200)) {
    if (context.body.data) {
      context.status = 200
    } else if (context.body.errors) {
      context.status = 500
    } else {
      context.status = 204
    }
  }
}

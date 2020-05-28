export default (message, connection) => {
	const [token] = message.params
	connection.token = token
	connection.emit('acknowledge')
}

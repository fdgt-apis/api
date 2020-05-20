module.exports = (message, connection) => {
	const [token] = message.params
	connection.token = token

	if (connection.username && connection.token) {
		connection.emit('acknowledge')
	}
}

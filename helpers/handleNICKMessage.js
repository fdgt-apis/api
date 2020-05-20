module.exports = (message, connection) => {
	const [username] = message.params
	connection.username = username

	if (connection.username && connection.token) {
		connection.emit('acknowledge')
	}
}

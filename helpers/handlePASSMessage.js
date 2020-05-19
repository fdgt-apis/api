module.exports = (message, connection) => {
	const [token] = message.params
	connection.token = token
}

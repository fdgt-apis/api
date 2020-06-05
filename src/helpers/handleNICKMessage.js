export default (message, connection) => {
	const [username] = message.params
	connection.username = username
	connection.emit('acknowledge')
}

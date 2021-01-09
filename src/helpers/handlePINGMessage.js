export default (message, connection) => {
	connection.sendPong(message.params.join(" "));
}

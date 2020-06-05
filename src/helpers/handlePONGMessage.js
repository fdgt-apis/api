export default (message, connection) => {
	const { pongTimeoutID } = connection

	if (pongTimeoutID) {
		clearTimeout(pongTimeoutID)
	}
}

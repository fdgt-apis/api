module.exports = (message, connection) => {
  const { pongTimeoutID } = connection

  if (pongTimeoutID) {
    clearTimeout(pongTimeoutID)
  }
}

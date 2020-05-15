module.exports = (message, connection) => {
  const [username] = message.params
  connection.username = username
}

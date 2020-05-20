#!/usr/bin/env node

// Module imports
const { v4: uuid } = require('uuid')
const net = require('net')
const tls = require('tls')
const WebSocket = require('ws')





// Local imports
const Connection = require('./structures/Connection')
const log = require('./helpers/log')
const User = require('./structures/User')





// Local constants
const {
	IRC_PORT = 6667,
	PORT,
	WS_PORT = 3001,
} = process.env
const HOST = 'tmi.twitch.tv'
const fdgtUser = new User({ username: 'fdgt' })
const wsServer = new WebSocket.Server({ port: PORT || WS_PORT })





const handleConnection = socket => {
	const connection = new Connection({
		fdgtUser,
		socket,
		type: socket.send ? 'websocket' : 'irc',
	})
}

wsServer.on('connection', handleConnection)

const netServer = net.createServer(handleConnection)

netServer.listen(IRC_PORT)

log('Server started.')
log(`Listening for WebSocket connections on port ${WS_PORT}.`)
log(`Listening for IRC connections on port ${IRC_PORT}.`)

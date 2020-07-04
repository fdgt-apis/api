#!/usr/bin/env node

require('dotenv').config()

// Module imports
import { v4 as uuid } from 'uuid'
import net from 'net'
import tls from 'tls'
import WebSocket from 'ws'





// Local imports
import API from './structures/API'
import Connection from './structures/Connection'
import log from './helpers/log'
import User from './structures/User'





// Local constants
const {
	IRC_PORT = 6667,
	WEB_PORT = 3000,
	WS_PORT = 3001,
} = process.env
const { HOST } = process.env
const fdgtUser = new User({ username: 'fdgt' })
const wsServer = new WebSocket.Server({ port: WS_PORT })





const handleConnection = socket => {
	const connection = new Connection({
		fdgtUser,
		socket,
	})
}

wsServer.on('connection', handleConnection)

const netServer = net.createServer(handleConnection)

netServer.listen(IRC_PORT)
API.listen(WEB_PORT)

log('Server started.')
log(`Listening for Web connections on port ${WEB_PORT}.`)
log(`Listening for WebSocket connections on port ${WS_PORT}.`)
log(`Listening for IRC connections on port ${IRC_PORT}.`)

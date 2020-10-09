#!/usr/bin/env node

require('dotenv').config()

// Module imports
import { v4 as uuid } from 'uuid'
import fs from 'fs-extra'
import net from 'net'
import tls from 'tls'
import WebSocket from 'ws'





// Local imports
import API from 'structures/API'
import Connection from 'structures/Connection'
import log from 'helpers/log'
import User from 'structures/User'





// Local constants
const {
	CERT_PATH,
	KEY_PATH,
	IRC_PORT = 6667,
	USE_TLS = false,
	WEB_PORT = 3000,
	WS_PORT = 3001,
} = process.env
const fdgtUser = new User({ username: 'fdgt' })





const handleConnection = (socket, request) => {
	let headers = {}
	let query = {}

	if (request) {
		const queryParams = new URL(request.url, `http://${request.headers.host}`).searchParams
		query = [...queryParams.entries()].reduce(function (accumulator, [key, value]) {
			accumulator[key] = value
			return accumulator
		}, {})
		headers = { ...request.headers }
	}

	const connection = new Connection({
		fdgtUser,
		headers,
		query,
		socket,
	})
}

;(async () => {
	const wsServer = new WebSocket.Server({ port: WS_PORT })

	wsServer.on('connection', handleConnection)

	let tcpServer = null

	if (USE_TLS) {
		let [cert, key] = await Promise.all([
			fs.readFile(CERT_PATH),
			fs.readFile(KEY_PATH),
		])
		const options = {
			cert,
			key,
		}
		tcpServer = tls.createServer(options, handleConnection)
	} else {
		tcpServer = net.createServer(handleConnection)
	}

	tcpServer.listen(IRC_PORT)
	API.listen(WEB_PORT)

	log('Server started.')
	log(`Listening for Web connections on port ${WEB_PORT}.`)
	log(`Listening for WebSocket connections on port ${WS_PORT}.`)
	log(`Listening for IRC connections on port ${IRC_PORT}.`)
})()

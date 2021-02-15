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
	IRC_TLS_PORT = 6697,
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

	let tcpServer = net.createServer(handleConnection)
	let tcpSSLServer = null

	if (USE_TLS) {
		let [cert, key] = await Promise.all([
			fs.readFile(CERT_PATH, 'utf8'),
			fs.readFile(KEY_PATH, 'utf8'),
		])
		const options = {
			cert,
			key,
		}
		tcpSSLServer = tls.createServer(options, handleConnection)
		tcpSSLServer.listen(IRC_TLS_PORT)
	}

	tcpServer.listen(IRC_PORT)
	API.listen(WEB_PORT)

	log('Server started.')
	log(`Listening for Web connections on port ${WEB_PORT}.`)
	log(`Listening for WebSocket connections on port ${WS_PORT}.`)
	log(`Listening for IRC (non-TLS) connections on port ${IRC_PORT}.`)

	if (USE_TLS) {
		log(`Listening for IRC (TLS) connections on port ${IRC_TLS_PORT}.`)
	}
})()

// Local imports
import { createFDGTUser } from '../test-helpers/createFDGTUser'
import { createWSSocket } from '../test-helpers/createWSSocket'
import Connection from 'structures/Connection'





export function createConnection (socket) {
	return new Connection({
		fdgtUser: createFDGTUser(),
		headers: {},
		query: {},
		socket: createWSSocket(),
	})
}

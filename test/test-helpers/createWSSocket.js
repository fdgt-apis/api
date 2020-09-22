// Module imports
import EventEmitter from 'events'





class WSSocket extends EventEmitter {
	send = () => {}
	terminate = () => {}
}

export function createWSSocket () {
	return new WSSocket
}

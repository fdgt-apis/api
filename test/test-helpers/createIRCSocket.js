// Module imports
import EventEmitter from 'events'





export class IRCSocket extends EventEmitter {
	end = () => {}
	write = () => {}
}

export function createIRCSocket () {
	return new IRCSocket
}

// Module imports
import path from 'path'





// Local imports
import { render as bitsMock } from '../data-mocks/bits'
import { render as emoteonlyMock } from '../data-mocks/emoteonly'
import { render as extendsubMock } from '../data-mocks/extendsub'
import { render as giftpaidupgradeMock } from '../data-mocks/giftpaidupgrade'
import { render as primepaidupgradeMock } from '../data-mocks/primepaidupgrade'
import { render as raidMock } from '../data-mocks/raid'
import { render as resubscriptionMock } from '../data-mocks/resubscription'
import { render as slowmodeMock } from '../data-mocks/slowmode'
import { render as subgiftMock } from '../data-mocks/subgift'
import { render as submysterygiftMock } from '../data-mocks/submysterygift'
import { render as subscriptionMock } from '../data-mocks/subscription'
import { render as subsonlyMock } from '../data-mocks/subsonly'





// Local constants
const mocks = {
	bits: bitsMock,
	emoteonly: emoteonlyMock,
	extendsub: extendsubMock,
	giftpaidupgrade: giftpaidupgradeMock,
	primepaidupgrade: primepaidupgradeMock,
	raid: raidMock,
	resubscription: resubscriptionMock,
	slowmode: slowmodeMock,
	subgift: subgiftMock,
	submysterygift: submysterygiftMock,
	subscription: subscriptionMock,
	subsonly: subsonlyMock,
}





export default options => {
	const { command } = options
	const mock = mocks[command]

	if (mock) {
		return mock
	}

	return null
}

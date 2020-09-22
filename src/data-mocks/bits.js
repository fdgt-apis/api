// Local imports
import { CHEERMOTE_PREFIXES } from 'data/CHEERMOTE_PREFIXES'
import { DOLLARBUCK_CORRELATIONS } from 'data/DOLLARBUCK_CORRELATIONS'
import { incrementStat } from 'helpers/incrementStat'





// Local constants
const { HOST } = process.env





export const defaults = {
	bitscount: 100,
}

/**
 * `bits` events are fired when a user sends a message to a Twitch channel that contains [`bits`](https://help.twitch.tv/s/article/guide-to-cheering-with-bits).
 *
 * @alias `bits`
 *
 * @param {number} bitscount=100 The number of bits to attach to the message.
 * @param {string} color - The color of the user's name in chat.
 * @param {string} message The body of the message.
 * @param {string} messageid - The ID of the message.
 * @param {string} timestamp - The millisecond timestamp when the message was sent.
 * @param {string} userid - The ID of the user sending the message.
 * @param {string} username - The username of the user sending the message.
 *
 * @example @lang off <caption>Fires a `bits` event with no message</caption>
 * bits
 *
 * @example @lang off <caption>Fires a `bits` event with a custom amount of bits and the message "Woohoo!"</caption>
 * bits --bitscount 999999 Woohoo!
 */
export const render = (args = {}) => {
	const {
		bitscount,
		color,
		channel,
		channelid,
		message,
		messageid,
		timestamp,
		userid,
		username,
	} = {
		...defaults,
		...args,
	}

	const emotes = []

	let processedMessage = message
	let totalBits = 0

	if (message) {
		const cheermotes = [...message.matchAll(new RegExp(`(?:${CHEERMOTE_PREFIXES.join('|')})(\\d+)`, 'giu'))]

		totalBits = cheermotes.reduce((accumulator, cheermote) => {
			return accumulator + parseInt(cheermote[1], 10)
		}, 0)
	}

	if (totalBits === 0) {
		totalBits = bitscount

		if (processedMessage) {
			processedMessage += ' '
		}

		processedMessage += `cheer${totalBits}`
	}

	incrementStat('events/bits')
	incrementStat('totalBits', totalBits)
	incrementStat('dollarbucksSaved', totalBits * DOLLARBUCK_CORRELATIONS['bit'])

	return {
		'badge-info': [],
		badges: [],
		bits: totalBits,
		color,
		'display-name': username,
		emotes: null,
		flags: null,
		id: messageid,
		mod: 0,
		'room-id': channelid,
		subscriber: 0,
		'tmi-sent-ts': timestamp,
		turbo: 0,
		'user-id': userid,
		'user-type': null,
		message: `${username}!${username}@${username}.${HOST} PRIVMSG #${channel} :${processedMessage}`,
	}
}

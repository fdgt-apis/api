// Module imports
import { promisify } from 'util'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'





// Local imports
import Route from 'structures/Route'





// Local constants
const readFile = promisify(fs.readFile)





export const route = new Route({
	handler: async context => {
		const contributorsPath = path.resolve(process.cwd(), '.all-contributorsrc')
		let allContributorsFile = null

		try {
			allContributorsFile = await readFile(contributorsPath, 'utf8')
		} catch (error) {
			context.errors.push(error.message)
			return
		}

		const { contributors } = JSON.parse(allContributorsFile)

		try {
			await Promise.all(contributors.map(async contributor => {
				const profile = await fetch(`https://api.github.com/users/${contributor.login}`, {
					headers: {
						Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
					},
				})
				const profileJSON = await profile.json()

				contributor.twitter = profileJSON.twitter_username

				return contributor
			}))

			context.data = contributors
		} catch (error) {
			context.errors.push(error.message)
			return
		}
	},
	route: '/fdgt/v1/contributors',
})

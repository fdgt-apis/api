// Module imports
import fetch from 'node-fetch'





// Local imports
import Route from 'structures/Route'





export const route = new Route({
	handler: async context => {
		let sponsors = null
		let sponsorshipTiers = null

		try {
			const {
				data,
				errors,
			} = await fetch('https://api.github.com/graphql', {
				body: JSON.stringify({
					query: `query {
						user(login: "trezy") {
							sponsorsListing {
								tiers(first: 10) {
									nodes {
										description
										id
										monthlyPriceInDollars
										name
									}
								}
							}
							sponsorshipsAsMaintainer(first: 100) {
								nodes {
									createdAt
									privacyLevel
									sponsorEntity {
										... on User {
											avatarUrl
											id
											login
											name
											status {
												emoji
												message
											}
											twitterUsername
											url
											websiteUrl
										}
										... on Organization {
											avatarUrl
											id
											login
											name
											twitterUsername
											url
											websiteUrl
										}
									}
									tier {
										id
										monthlyPriceInDollars
										name
									}
								}
							}
						}
					}`.replace(/\t/g, ''),
				}),
				headers: {
					Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
				},
				method: 'post',
			}).then(response => response.json())

			if (errors) {
				errors.forEach(error => context.errors.push(error))
			}

			if (data) {
				sponsorshipTiers = data.user.sponsorsListing.tiers.nodes.map(sponsorshipTier => ({
					attributes: { ...sponsorshipTier },
					id: sponsorshipTier.id,
					type: 'tier',
				})).slice(1)

				sponsors = data.user.sponsorshipsAsMaintainer.nodes.reduce((accumulator, node) => {
					const {
						privacyLevel,
						sponsorEntity,
						tier,
					} = node

					const sponsorshipTierExists = Boolean(sponsorshipTiers.find(sponsorshipTier => sponsorshipTier.id === tier.id))

					if (sponsorshipTierExists && (privacyLevel === 'PUBLIC')) {
						const sponsor = {
							attributes: { ...sponsorEntity },
							id: sponsorEntity.id,
							relationships: {
								tier: {
									data: {
										id: tier.id,
										type: 'tier',
									}
								},
							},
						}

						accumulator[sponsorEntity.id] = sponsor
					}

					return accumulator
				}, {})
			}

			context.data = sponsors
			context.included = sponsorshipTiers
		} catch (error) {
			context.errors.push(error.message)
			return
		}
	},
	route: '/fdgt/v1/sponsors',
})

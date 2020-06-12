const packageData = require('./package.json')

const repo = packageData.repository.url

module.exports = {
	deploy: {
		production: {
			host: [process.env.DEPLOY_HOST],
			path: '/var/www/fdgt',
			'post-deploy': 'source ~/.zshrc; yarn install; yarn build;',
			ref: 'origin/main',
			repo,
			user: 'deploy',
		},
	},
}

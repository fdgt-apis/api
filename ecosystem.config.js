module.exports = {
	apps: [{
		name: 'irc.fdgt.dev',
		script: './dist/index.js'
	}],
	deploy: {
		production: {
			user: 'deploy',
			host: [process.env.DEPLOY_HOST],
			ref: 'origin/master',
			repo: 'git@github.com:fdgt-apis/api.git',
			path: '/var/www/fdgt',
			'post-deploy': 'yarn install && yarn build',
		 },
	},
}

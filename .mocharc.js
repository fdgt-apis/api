module.exports = {
	parallel: true,
	recursive: true,
	require: [
		'dotenv/config',
		'@babel/register',
		'test/setup.js',
	]
}

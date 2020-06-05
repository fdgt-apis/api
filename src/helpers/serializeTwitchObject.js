export default object => {
	const foo = Object.entries(object).reduce((accumulator, [key, value]) => {
		if (accumulator) {
			accumulator += ';'
		}

		return `${accumulator}${key}=${value || ''}`
	}, '').replace(/\s/gu, '\\s')

	return foo
}

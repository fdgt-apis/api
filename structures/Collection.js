module.exports = class {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	_data = []





	/***************************************************************************\
		Public Methods
	\***************************************************************************/

	add = item => this.data.push(item)

	findByID = id => this.findByKey('id')

	findByKey = (key, value) => this.data.find(item => (item[key] === value))

	getRandom = () => this.data[Math.floor(Math.random() * this.data.length)]

	remove = item => this.data.filter(datum => datum !== item)





	/***************************************************************************\
		Getters
	\***************************************************************************/

	get isEmpty () {
		return !this.data.length
	}

	get ids () {
		return this.data.map(({ id }) => id)
	}

	get data () {
		return this._data
	}
}

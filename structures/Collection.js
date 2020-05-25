module.exports = class {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	_data = []





	/***************************************************************************\
		Public Methods
	\***************************************************************************/

	add = item => this.data.push(item)

	findByID = id => this.findByKey('id', id)

	findByKey = (key, value) => this.data.find(item => (item[key] === value))

	getRandom = () => this.data[Math.floor(Math.random() * this.data.length)]

	remove = item => {
		const itemIndex = this.data.indexOf(item)
		this.data.splice(itemIndex, 1)
	}





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

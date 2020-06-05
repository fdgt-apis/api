export default class {
	/***************************************************************************\
		Local Properties
	\***************************************************************************/

	_data = []





	/***************************************************************************\
		Public Methods
	\***************************************************************************/

	add = item => this.data.push(item)

	clear = item => this.data.splice(0, this.data.length)

	findByID = id => this.findByKey('id', id)

	findByKey = (key, value) => this.data.find(item => (item[key] === value))

	getRandom = () => this.data[Math.floor(Math.random() * this.data.length)]

	remove = item => this.data.splice(this.data.indexOf(item), 1)





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

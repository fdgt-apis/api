class UserList {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  _users = []





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  addUser = user => {
    this.users.push(user)
  }

  findByID = id => this.users.find(user => (user.id === id))

  findByUsername = username => this.users.find(user => (user.username === username))

  getRandomUser = () => this.users[Math.floor(Math.random() * this.users.length)]





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isEmpty () {
    return !this.users.length
  }

  get userIDs () {
    return this.users.map(({ id }) => id)
  }

  get usernames () {
    return this.users.map(({ username }) => username)
  }

  get users () {
    return this._users
  }
}





module.exports = UserList

// Module imports
const uuid = require('uuid/v4')





// Local imports
const UserList = require('./UserList')





// anonsubgift

class Channel extends UserList {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  id = uuid()

  isConnected = false





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  connect = () => {
    this.isConnected = true
  }

  constructor (options) {
    super(options)

    if (options.name) {
      options.name = options.name.toLowerCase()
    }

    this.options = options

    this.isConnected = Boolean(options.isConnected)
  }

  disconnect = () => {
    this.isConnected = false
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get name () {
    return this.options.name
  }
}





module.exports = Channel

// Module imports
const uuid = require('uuid/v4')





// Local imports
const generateRandomColorHex = require('../helpers/generateRandomColorHex')





class User {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  color = generateRandomColorHex()

  id = uuid()





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get username () {
    return this.options.username
  }
}





module.exports = User

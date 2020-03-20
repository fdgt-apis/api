// Module imports
const { v4: uuid } = require('uuid')





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

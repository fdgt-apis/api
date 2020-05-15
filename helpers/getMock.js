// Module imports
const fs = require('fs')
const path = require('path')





// Local imports
const renderTemplate = require('./renderTemplate')
const serializeTwitchObject = require('./serializeTwitchObject')





// Local constants
const mocksPath = path.resolve(__dirname, '..', 'data-mocks')





module.exports = options => {
  const {
    args,
    channel,
    command,
    user,
  } = options

  try {
    const response = renderTemplate({
      args,
      channel,
      template: require(path.resolve(mocksPath, command)),
      user,
    })

    return `@${serializeTwitchObject(response.tags)} :${response.message}`
  } catch (error) {
    return null
  }
}

// Module imports
const fs = require('fs')
const path = require('path')





// Local imports
const serializeTwitchObject = require('./serializeTwitchObject')





// Local constants
const mocksPath = path.resolve(__dirname, '..', 'data-mocks')





const getMock = (type, data = {}) => {
  const response = {}

  try {
    const dataTemplate = require(path.resolve(mocksPath, type))
    let message = null

    const renderedTemplate = Object.entries(dataTemplate).reduce((accumulator, [key, value]) => {
      if (Array.isArray(value)) {
        value = value.join(',')
      }

      if (typeof value === 'string') {
        accumulator[key] = value.replace(/(?:<(\w+)>)/gu, (match, replacementKey) => {
          if (data[replacementKey]) {
            return data[replacementKey]
          }

          return match
        })
      } else if (data[key]) {
        accumulator[key] = data[key]
      }

      return accumulator
    }, { ...dataTemplate })

    if (renderedTemplate.message) {
      response.message = renderedTemplate.message
      delete renderedTemplate.message
    }

    response.tags = renderedTemplate
  } catch (error) {
    response.tags = {}
    response.message = `:${data.host} USERNOTICE #${data.channel} fdgt doesn't have a data template for \`${type}\` events.`
  }

  response.renderedMessage = `@${serializeTwitchObject(response.tags)} :${response.message}`

  return response
}





module.exports = getMock

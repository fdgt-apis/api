// Module imports
const fs = require('fs')
const path = require('path')





// Local constants
const mocksPath = path.resolve(__dirname, '..', 'data-mocks')





const getMock = (type, data = {}) => {
  try {
    const dataTemplate = require(path.resolve(mocksPath, type))
    const response = {}
    let message = null

    const renderedTemplate= Object.entries(dataTemplate).reduce((accumulator, [key, value]) => {
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

    return response
  } catch (error) {
    console.error(`Data template for \`${type}\` event doesn't exist.`, error)
    return false
  }
}





module.exports = getMock

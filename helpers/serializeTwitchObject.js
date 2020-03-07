const serializeTwitchObject = object => Object.entries(object).reduce((accumulator, [key, value]) => {
  if (accumulator) {
    accumulator += ';'
  }

  return `${accumulator}${key}=${value || ''}`
}, '')





module.exports = serializeTwitchObject

module.exports = object => Object.entries(object).reduce((accumulator, [key, value]) => {
  if (accumulator) {
    accumulator += ';'
  }

  return `${accumulator}${key}=${value || ''}`
}, '').replace(/\s/gu, '\\s')

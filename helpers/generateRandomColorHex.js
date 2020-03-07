// Local constants
const hexCharacters = '0123456789ABCDEF'





const generateRandomColorHex = () => {
  let hex = ''

  while (hex.length < 6) {
    hex += hexCharacters[Math.floor(Math.random() * hexCharacters.length)]
  }

  return `#${hex}`
}





module.exports = generateRandomColorHex

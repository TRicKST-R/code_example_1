/*eslint-disable*/

/**
 * returns a random integer value with fixed length or in range (min, max)
 * @param {Int} length - length of random number
 * @param {Int} min - minimal value (optional, set up automatically by length)
 * @param {Int} max - maximal value (optional, set up automatically by length)
 *
 * if you set up min and max - length will not be used.
 */
const genInt = (
  length,
  min = Math.pow(10, length - 1) - 1,
  max = Math.pow(10, length) - 1
) => Math.floor(Math.random() * (max - min + 1)) + min

/**
 * returns a string of random alphabet chars with spaces
 * @param {Int} words - number of words in result string
 * @param {Int} wl_min - minimal length of one word
 * @param {Int} wl_max - maximal length of one word
 * @param {Array} alphabet - array/string of avaliable chars for filling (default : english alphabet in upper case only)
 */
const genText = (
  words = 3,
  wl_min = 2,
  wl_max = 12,
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
) => {
  let full_text = ''
  for (let i = 0; i < words; i += 1) {
    const w_length = genInt(0, wl_min, wl_max)

    for (let j = 0; j < w_length; j += 1) {
      full_text += alphabet[genInt(null, 0, alphabet.length - 1)]
    }
    full_text += ' '
  }
  return full_text
}

export default { genInt, genText }

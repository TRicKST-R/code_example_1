import bcrypt from 'bcrypt'
import config from '../config'

export const generatePass = () => {
  const password = config.userPassword
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

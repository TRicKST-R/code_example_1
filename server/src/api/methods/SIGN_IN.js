import tokenizer from '../../utils/tokenizer'
import log from '../../utils/log'
import bcrypt from 'bcrypt'
import inspector from 'schema-inspector'
import handleSession from './../../utils/handleSession'

const payloadValidationSchema = {
  type: 'object',
  strict: true,
  properties: {
    email: { type: 'string', pattern: 'email' },
    password: { type: 'string', minLength: 6, maxLength: 16 }
  }
}
export default async ({
  payload = {},
  socket,
  emitAction,
  db: { User, Company },
  sessionData,
  connectedUsers
}) => {
  let user = null
  const validationData = { email: payload.email, password: payload.password }
  const result = inspector.validate(payloadValidationSchema, validationData)
  if (!result.valid) {
    log.info(`Failed attempt to log in: ${result.format()}`)
    const message = 'Email or password is invalid'
    emitAction('SNACK', { message })
    log.err(`SIGN_IN, ${message}`)
    emitAction('SPINNER', { SignIn: false })
    return false
  }
  try {
    const { email } = payload

    user = (await User.findOne({
      where: { email: email.toLowerCase() }
    })).get({
      plain: true
    })
  } catch (err) {
    emitAction('SNACK', { message: err.message })
    log.err(`SIGN_IN, ${err}`)
    emitAction('SPINNER', { SignIn: false })
  }
  if (!user) {
    // if user not found, then notify client about wrong email
    const message = 'Email is not recognized'
    emitAction('SNACK', { message })
    log.err(`SIGN_IN, ${message}`)
    emitAction('SPINNER', { SignIn: false })
    return false
  }
  // compare passwords
  const { password } = payload
  log.info(user)
  const isPasswordMatch = bcrypt.compareSync(password, user.password)
  log.info(isPasswordMatch)
  if (!isPasswordMatch) {
    const message = 'Incorrect password'
    emitAction('SNACK', { message })
    log.err(`SIGN_IN, ${message}`)
    emitAction('SPINNER', { SignIn: false })
    return false
  }
  try {
    let token = await tokenizer.new(user.id)
    if (payload.full) {
      socket.emit('token', token)
      await handleSession({ Company, user, sessionData, emitAction })
      connectedUsers.set(socket.id, sessionData.get('_id'))
      emitAction('SPINNER', { SignIn: false })
    } else {
      const userForLs = { token, name: user.user_name, email: user.email }
      emitAction('ADD_USER', userForLs)
    }
  } catch (err) {
    emitAction('SNACK', { message: err.message })
    log.err(`SIGN_IN, ${err}`)
    emitAction('SPINNER', { SignIn: false })
  }
}

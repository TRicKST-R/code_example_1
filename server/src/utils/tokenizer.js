import jwt from 'jsonwebtoken'
import config from '../config'
import log from './log'

const sign = _id => {
  return jwt.sign({ _id }, config.jwtSecret, {
    expiresIn: config.tokenExpiration
  })
}
const tokenizer = {
  new: _id =>
    new Promise((resolve, reject) => {
      resolve(sign(_id))
    }),
  verify: token =>
    new Promise(resolve => {
      jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
          log.err('jwt verification', err)
          resolve({ success: false })
        } else {
          const { _id } = decoded
          let newToken = token
          // check if it's time to renew token
          const tokenRenewDelaySec = config.tokenRenewDelay * 24 * 60 * 60
          // `* 1000` converts seconds to ms
          if ((decoded.exp - tokenRenewDelaySec) * 1000 < Date.now()) {
            newToken = sign(_id)
          }
          resolve({ _id, newToken, success: true })
        }
      })
    }).catch(err => {
      log.err('jwt verification critical error', err)
    })
}

export const jwtMiddlware = (allowUnauthorized = true) => (socket, next) => {
  // Adds to socket a new authorizationData property
  const { token, clientType = '', clientVersion = '' } = socket.request._query
  socket.authorizationData = {
    clientType,
    clientVersion,
    isLoggedIn: false,
    _id: ''
  }
  if (token && token !== 'undefined') {
    // Validate token here
    tokenizer.verify(token).then(res => {
      if (res.success) {
        socket.authorizationData = {
          isLoggedIn: true,
          _id: res._id
        }
        if (res.newToken !== token) {
          socket.emit('token', res.newToken)
        }
      }
      next()
    })
    return
  }
  allowUnauthorized ? next() : next(new Error('not authorized'))
}

export default tokenizer

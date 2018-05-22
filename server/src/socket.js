import socketIo from 'socket.io'
import log from './utils/log'
import EventEmitter from './EventEmitter'
import { jwtMiddlware } from './utils/tokenizer'
import api from './api'
import handleSession from './utils/handleSession'

export default async (server, port, hostname, db) => {
  const { User, Company } = db
  const io = socketIo(server)
  const connectedUsers = new Map()

  io.use(jwtMiddlware())
  io.on('connection', async socket => {
    const eventEmitter = new EventEmitter({ socket })
    log.debug('new connection')
    const sessionData = new Map()
    socket.emit('connected')
    const emitAction = (...args) => eventEmitter.emit(...args)

    if (socket.authorizationData.isLoggedIn) {
      /* Users table is for app users, not for admins  */
      try {
        let user = await User.findById(socket.authorizationData._id)
        if (!user) {
          emitAction('SESSION_STATE', { isLoggedIn: false })
        } else {
          await handleSession({ Company, user, sessionData, emitAction })
        }
      } catch (error) {
        console.log(error)
        log.err(error)
        emitAction('SNACK', { message: 'Something went wrong with admin' })
      }
    }

    socket.on('action', (action = {}) => {
      const { type, payload } = action
      if (!type) {
        return socket.emit('err', { code: 1 })
      }
      const actionType = type.substr(7, type.length)
      log.debug(
        `${sessionData.get(
          '_id'
        )} | Action: ${actionType}. Payload: ${JSON.stringify(payload)}`
      )
      if (!sessionData.get('_id')) {
        if (
          ['SIGN_IN', 'SIGN_UP', 'FORGOT_PASSWORD'].indexOf(actionType) === -1
        ) {
          console.log(`Not authorized, abort action: ${actionType}`)
          return
        }
      }

      if (api[actionType]) {
        api[actionType]({
          payload,
          socket,
          emitAction,
          db,
          sessionData,
          connectedUsers
        })
      } else {
        return socket.emit('err', { code: 1 })
      }
    })
    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id)
    })
  })
}

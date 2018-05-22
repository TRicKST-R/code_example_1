import log from '../../utils/log'
import config from '../../config'

export default async ({
  sessionData,
  payload = {},
  socket,
  emitAction,
  db: { Order }
}) => {
  try {
    /* actually here array of id's */
    const pseudoId = payload
    const role = sessionData.get('role')
    const name = sessionData.get('name')
    let header = `Order details from ${name}`
    if (role === config.roles.brewery) {
      header = `Order details for ${name}`
    }

    const order = await Order.findAll({
      where: {
        pseudoId //eslint-disable-line
      },
      order: [['id', 'ASC']]
    })

    emitAction('SHOW_ORDER', order)
    emitAction('ORDER_SET_NAME', header)
  } catch (error) {
    log.err(error)
  }
}

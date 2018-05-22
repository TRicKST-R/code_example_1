import log from '../../utils/log'
// import { constructWhereClause } from './sharedCode/auxiliary'

export default async ({ payload = {}, socket, emitAction, db: { Order } }) => {
  try {
    const id = payload
    const orders = await Order.findAll({
      where: {
        productId: id
      }
    })

    emitAction('SHOW_ORDERS_FOR_PRODUCT', orders)
  } catch (error) {
    log.err(error)
  }
}

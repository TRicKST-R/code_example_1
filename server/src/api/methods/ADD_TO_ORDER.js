import log from '../../utils/log'
import { createId } from './sharedCode/auxiliary'
import config from '../../config'

export default async ({
  payload,
  socket,
  emitAction,
  sessionData,
  db: { Order, sequelize }
}) => {
  try {
    const { product, count, selectedWH } = payload //eslint-disable-line
    const productId = product.data.id
    const breweryId = product.data.breweryId
    const { roles: { wholesaler }, statuses: { newStatus } } = config

    const wholesalerId = sessionData.get('companyId')
    const role = sessionData.get('role')

    if (wholesaler === role) {
      const query = `SELECT "pseudoId", "breweryId", "wholesalerId", "productId" FROM orders
                      JOIN products p ON orders."productId" = p.id
                    WHERE 
                      -- find any new orders from this Whs to product brewery --
                      orders.status = 'new' AND 
                      orders."wholesalerId" = $wholesalerId AND   
                      "breweryId" = $breweryId`
      let existingOrders = await sequelize.query(query, {
        bind: { wholesalerId, breweryId },
        type: sequelize.QueryTypes.SELECT
      })
      /* we use it as unique id  */
      let pseudoId = createId() //eslint-disable-line

      /* if added product id already present */
      let productIsPresent = existingOrders.filter(
        ({ productId: orderProductId }) => productId === orderProductId
      )

      /* (1) if no 'new' orders for product's brewery from this wholesaler or  */
      /* (2) if that product id absent but (1) is false - new products ordered   */
      if (existingOrders.length === 0 || productIsPresent.length === 0) {
        const newOrder = {
          status: newStatus,
          count,
          type: 'order',
          productId,
          wholesalerId,
          /* in case (2) we want to use already present pseudoId */
          pseudoId:
            existingOrders.length > 0 ? existingOrders[0]['pseudoId'] : pseudoId //eslint-disable-line
        }

        await Order.create(newOrder)
        emitAction('REQUIRE_ORDER_UPDATE', { requireUpdate: true })
        emitAction('SNACK', { message: `Product added to orders` }) //eslint-disable-line
      } else {
        /* in that case product we want to add is already present in db and we need to update it */
        await Order.update(
          { count },
          {
            where: {
              wholesalerId,
              productId,
              status: newStatus
            }
          }
        )

        emitAction('REQUIRE_ORDER_UPDATE', { requireUpdate: true })
        emitAction('SNACK', { message: `Product added to orders` })
      }
    }
  } catch (error) {
    log.err(error.message)
    emitAction('SNACK', { message: `Failed to add product to orders` })
  }
}

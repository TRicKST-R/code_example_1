import log from '../../utils/log'
import config from '../../config'
import moment from 'moment'

const { statuses: { confirmed } } = config

export default async ({
  sessionData,
  payload = {},
  socket,
  emitAction,
  db: { Order, Inventory, sequelize }
}) => {
  try {
    const { id, updated, message, pseudoId } = payload
    const { status = '', confirm_date } = updated
    const companyId = sessionData.get('companyId')
    let order = []
    /* in that case we are updating all set */
    if (status.length > 0) {
      await Order.update(updated, {
        where: {
          pseudoId
        }
      })

      order = await Order.findAll({
        where: {
          pseudoId
        },
        order: [['id', 'ASC']]
      })

      /* insert data into Inventory */
      if (status === confirmed) {
        let getData = `SELECT
              (count + COALESCE(add, 0)) as add,
              confirm_date as date,
              orders."productId",
              "wholesalerId" as "companyId",
              "breweryId",
              dn."distributionCenterId",
              net
            FROM orders
              -- get brewery --
              JOIN products p on orders."productId" = p.id
              JOIN distribution_network dn on dn."companyId" = "wholesalerId"
              JOIN distribution_centers dc on dn."distributionCenterId" = dc.id
              LEFT JOIN inventories i on i."productId" = orders."productId" and i.date = confirm_date
            WHERE dc.brewery = "breweryId"
            AND orders."productId" = $productId
            AND orders.status = 'confirmed'
            AND "wholesalerId" = $companyId
            AND "confirm_date" = '${moment(new Date(confirm_date)).format(
              'YYYY-MM-DD'
            )}'`
        /* insert for each product 2 items in inventory */

        order.map(async ({ productId }) => {
          let calculateData = await sequelize.query(getData, {
            bind: { productId, companyId },
            type: sequelize.QueryTypes.SELECT
          })
          /*  */
          await Inventory.create(calculateData[0])
        })
      }
    } else if (id) {
      /* in that case only one item */
      await Order.update(updated, { where: { id } })
      console.log('pseudoId: ', pseudoId)
      order = await Order.findAll({
        where: {
          pseudoId
        },
        order: [['id', 'ASC']]
      })
    }

    emitAction('REQUIRE_ORDER_UPDATE', { requireUpdate: true })
    emitAction('SHOW_ORDER', order)

    emitAction('SNACK', {
      message
    })
  } catch (error) {
    log.err(error)
  }
}

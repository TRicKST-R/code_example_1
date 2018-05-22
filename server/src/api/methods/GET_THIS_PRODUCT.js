import log from '../../utils/log'
import { constructWhereClause } from './sharedCode/auxiliary'

export default async ({
  payload = {},
  socket,
  emitAction,
  sessionData,
  db: { sequelize, Product, Inventory, DistributionCenter, Company }
}) => {
  try {
    const { filters } = payload

    const where = constructWhereClause(filters)

    const products = await Product.findAll({
      where: filters ? where : null
    })

    const productIds = products.map(product => product.id)

    let invQuery = `SELECT *
      FROM inventories
      WHERE
        inventories."productId" IN(:productIds)
      `
    let inventory = await sequelize.query(invQuery, {
      replacements: {
        productIds
      },
      type: sequelize.QueryTypes.SELECT
    })

    console.log('inventory: ', inventory)

    if (inventory.length < 1) {
      inventory = null
    }

    emitAction('SHOW_THIS_PRODUCT', {
      products,
      inventory
    })
  } catch (error) {
    log.err(error)
  }
}

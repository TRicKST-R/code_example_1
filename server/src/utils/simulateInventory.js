import Generator from './generator'
import log from './log'
import Sequelize from '../../node_modules/sequelize'

const rand = (min, max) => {
  return Generator.genInt(0, min, max)
}

const dateDiff = (one, two) => {
  const d1 = new Date(one)
  const d2 = new Date(two)
  return Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / (1000 * 3600 * 24))
}

const simulateInventory = async (sequelize, DB) => {
  const startDateQuery = await sequelize.query(
    'SELECT order_date FROM orders ORDER BY order_date ASC LIMIT 1',
    {
      returning: true,
      type: sequelize.QueryTypes.SELECT
    }
  )

  const finishDateQuery = await sequelize.query(
    'SELECT ship_date FROM orders WHERE ship_date IS NOT NULL ORDER BY ship_date DESC LIMIT 1',
    {
      returning: true,
      type: sequelize.QueryTypes.SELECT
    }
  )

  const periodLength = dateDiff(
    startDateQuery[0].order_date,
    finishDateQuery[0].ship_date
  )
  let currentDate = new Date(startDateQuery[0].order_date)

  console.log(periodLength)

  const index = await sequelize.query(
    'SELECT distribution_network."companyId" AS whs_id, companies.id AS brw_id, distribution_centers.id AS dc_id, products.id as product_id FROM companies, distribution_centers, distribution_network, products WHERE companies.id = distribution_centers.brewery AND distribution_network."distributionCenterId" = distribution_centers.id AND companies.id = products."breweryId" ORDER BY distribution_network,"companyId"',
    {
      returning: true,
      type: sequelize.QueryTypes.SELECT
    }
  )

  const indexList = {}

  index.map(row => {
    indexList[`${row.whs_id}-${row.product_id}`] = {
      dc: row.dc_id,
      bw: row.brw_id
    }
  })

  for (let i = 0; i < periodLength + 1; i++) {
    const orders = await sequelize.query(
      'SELECT * FROM orders WHERE confirm_date = ? AND type = ?',
      {
        replacements: [currentDate, 'order'],
        returning: true,
        type: sequelize.QueryTypes.SELECT
      }
    )
    log.info(` ${currentDate} -> ${orders.length} orders confirmed \n`)

    if (orders.length > 0) {
      for (let order of orders) {
        const dc = indexList[`${order.wholesalerId}-${order.productId}`].dc
        let inventory = await DB.Inventory.findOne({
          where: {
            date: currentDate,
            distributionCenterId: dc,
            productId: order.productId
          }
        })
        if (inventory === null) {
          let oldInventory = await DB.Inventory.findOne({
            where: {
              date: {
                [Sequelize.Op.lt]: currentDate
              },
              distributionCenterId: dc,
              productId: order.productId
            }
          })
          //  id |    date    | net  | add | sales | companyId | productId | distributionCenterId
          inventory = await DB.Inventory.create({
            date: currentDate,
            net: oldInventory.net,
            add: 0,
            sales: 0,
            companyId: oldInventory.companyId,
            productId: oldInventory.productId,
            distributionCenterId: dc
          })
        }
        inventory.net = inventory.net - order.count
        inventory.sales = +inventory.sales + +order.count
        if (inventory.net < 0) {
          inventory.add = rand(inventory.sales, inventory.sales + 150)
          inventory.net = +inventory.net + +inventory.add
        }
        await inventory.save()
      }
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return true
}

export default simulateInventory

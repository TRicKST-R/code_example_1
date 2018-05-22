import log from '../../utils/log'
import { constructWhereClause } from './sharedCode/auxiliary'
import { Op } from 'sequelize'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { Product, sequelize },
  sessionData
}) => {
  try {
    let { productsLoaded: offset, orderBy, filters } = payload
    const limit = 10
    const companyId = sessionData.get('companyId')
    const role = sessionData.get('role')
    let breweries = null
    /* if i'm a brewery i want to see all my products */
    if (role === 'BREWERY') {
      filters = [...filters, { column: 'breweryId', searchKey: companyId }]
    } else {
      /* get array of breweries Whs working with  */
      let query = `SELECT brewery as "breweryId"
                    FROM companies
                      JOIN distribution_network dn ON dn."companyId" = companies.id
                      JOIN distribution_centers dc ON dn."distributionCenterId" = dc.id
                    WHERE dn."companyId" = ${companyId}`
      /* restriction by brewery and by dc */
      breweries = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
      })
      breweries = breweries.map(({ breweryId }) => breweryId)
    }

    let where = constructWhereClause(filters)

    if (breweries && breweries.length > 0) {
      console.log('set breweries')
      where = {
        ...where,
        breweryId: {
          ...(where && where['breweryId'] ? where['breweryId'] : {}),
          [Op.or]: breweries
        }
      }
    }

    const { count, rows: products } = await Product.findAndCountAll({
      order: [[orderBy, 'ASC']],
      where: filters || where ? where : null,
      offset,
      limit
    })

    const canLoadMore = count - offset - products.length > 0

    emitAction('SHOW_MORE_PRODUCTS', {
      products,
      canLoadMore
    })
  } catch (error) {
    log.err(error)
  }
}

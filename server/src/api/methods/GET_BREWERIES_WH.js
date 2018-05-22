import log from '../../utils/log'
import inspector from 'schema-inspector'

const payloadValidationSchema = {
  type: 'object',
  strict: true,
  properties: {
    dateTo: { type: 'string' },
    dateFrom: { type: 'string' },
    products: { type: 'object' },
    wholesalers: { type: 'object' },
    distributionCenter: { type: ['number', 'string'], minLength: 1 }
  }
}

export default async ({
  payload = {},
  searchQuery,
  socket,
  emitAction,
  db: { sequelize },
  sessionData
}) => {
  let hasMore = false
  let list = []
  const companyId = sessionData.get('companyId')

  const result = inspector.validate(payloadValidationSchema, payload)
  if (!result.valid) {
    emitAction('SNACK', { message: result.format() })
    return false
  }
  console.log('payload: ', payload)
  console.log('companyId: ', companyId)
  const {
    distributionCenter,
    limit = 20,
    dateTo,
    dateFrom,
    products,
    wholesalers
  } = payload

  try {
    let { offset } = wholesalers

    let query = `SELECT *
                FROM orders
                  JOIN companies 
                    ON (orders."wholesalerId" = companies.id)
                  JOIN distribution_network 
                    ON (distribution_network."companyId" = orders."wholesalerId")
                WHERE distribution_network."distributionCenterId" = $distributionCenter 
                AND orders.confirm_date >= $dateFrom 
                AND orders.confirm_date <= $dateTo
                LIMIT $limit OFFSET $offset`
    list = await sequelize.query(query, {
      bind: { limit: limit + 1, offset, distributionCenter, dateTo, dateFrom },
      type: sequelize.QueryTypes.SELECT
    })

    emitAction('SET_BREWERIES_WH', {
      list,
      hasMore
    })
  } catch (err) {
    log.err(err.message)
  }

  try {
    let { offset } = products

    let query = `SELECT
                 id,
                 gpa,
                 package,
                 orders.count,
                 net,
                 --cast null to 0--
                 (COALESCE(net, 0) - orders.count) AS units
               FROM products
                 -- get orders data --
                 JOIN (SELECT
                         orders."productId",
                         sum(count) AS count
                       FROM orders
                       WHERE orders.confirm_date >= $dateFrom
                       AND   orders.confirm_date <= $dateTo
                       GROUP BY orders."productId") AS orders ON products.id = orders."productId"
                 -- get inventory data --
                 JOIN (SELECT
                         date,
                         net,
                         inventories."productId"
                       FROM inventories
                       WHERE
                         date = $dateTo
                      ) AS inventories
                   ON inventories."productId" = products.id
                   LIMIT $limit OFFSET $offset`

    list = await sequelize.query(query, {
      bind: {
        limit: limit + 1,
        offset,
        distributionCenter,
        dateTo,
        dateFrom,
        companyId
      },
      type: sequelize.QueryTypes.SELECT
    })

    if (list.length > limit) {
      /* remove last item from array */
      list.pop()
      hasMore = true
    }

    emitAction('SET_BREWERIES_PRODUCTS', {
      list,
      hasMore
    })
  } catch (err) {
    log.err(err.message)
  }
}

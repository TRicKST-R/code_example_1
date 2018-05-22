import log from '../../utils/log'
import config from '../../config'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { sequelize },
  sessionData
}) => {
  try {
    const { ordersLoaded: offset = 0, filters, type } = payload
    const limit = 10
    const { roles: { wholesaler } } = config
    const companyId = sessionData.get('companyId')
    // {"column":"breweryId","searchKey":"2"}
    const role = sessionData.get('role')
    /* todo - refactor */
    let filterQuery = filters.reduce(
      (previousValue, currentValue, index, array) => {
        let { column, searchKey } = array[index]
        if (!parseInt(searchKey)) {
          searchKey = `'${searchKey}'`
        }
        return `${previousValue} AND "${column}" = ${searchKey} `
      },
      ''
    )

    /* Whs case - we need get orders limited by Whs */
    let mainQuery = `SELECT
          "breweryId",
          status,
          order_date,
          accept_date,
          confirm_date,
          ship_date,
          type,
          "pseudoId",
          COUNT(*)
          OVER () AS total_count,
          array_agg(p.id) as id
        FROM orders
          JOIN products p ON orders."productId" = p.id`
    /* brewery case */
    let query = `${mainQuery}
          WHERE "breweryId" = $companyId
          AND type = $type
          ${filterQuery}
          GROUP BY "breweryId",type, status, order_date, accept_date, confirm_date, ship_date, "pseudoId"
          LIMIT $limit OFFSET $offset`

    if (role === wholesaler) {
      query = `${mainQuery}
          WHERE "wholesalerId" = $companyId
          AND type = $type
          ${filterQuery}
          GROUP BY "breweryId",type, status, order_date, accept_date, confirm_date, ship_date, "pseudoId"
          LIMIT $limit OFFSET $offset`
    }

    let list = await sequelize.query(query, {
      bind: { limit: limit, offset, companyId, type },
      type: sequelize.QueryTypes.SELECT
    })

    let count = list.length > 0 ? list[0]['total_count'] : 0
    const canLoadMore = count - offset - list.length > 0

    switch (type) {
      case 'order':
        emitAction('SHOW_MORE_ORDERS', {
          orders: list,
          canLoadMore
        })
        break
      case 'offer':
        emitAction('SHOW_MORE_ALLOCATIONS', {
          orders: list,
          canLoadMore
        })
        break
      default:
        break
    }
  } catch (error) {
    log.err(error)
  }
}

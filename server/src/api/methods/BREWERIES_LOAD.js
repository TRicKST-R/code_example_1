import log from '../../utils/log'
import { getConnection } from '../../db'
import Sequelize from 'sequelize'

export default async ({ payload = {}, socket, emitAction }) => {
  try {
    const sequelize = getConnection()

    const { whsId, offset, orderBy } = payload
    const limit = 10

    const breweries = await sequelize.query(
      `
    SELECT 
      companies.id AS company_id, 
      companies.company_name AS name, 
      states.state_name AS state, 
      COUNT(orders.id) AS orders_count
    FROM 
      public.companies, 
      public.states, 
      public.orders, 
      public.products
    WHERE 
      states.id = companies."stateId" AND
      orders."productId" = products.id AND
      products."breweryId" = companies.id AND
      orders."wholesalerId" = ?
    GROUP BY
     company_id, name, state
    ORDER BY
      ${orderBy}
    LIMIT ?
    OFFSET ?
    `,
      {
        replacements: [whsId, limit, offset],
        returning: true,
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const canLoadMore = !(breweries.length < limit)
    log.info(`${breweries.length} - ${limit}`)

    emitAction('BREWERIES_SHOW', {
      breweries,
      canLoadMore
    })
  } catch (error) {
    log.err(error)
  }
}

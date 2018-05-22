import log from '../../utils/log'
import Sequelize from 'sequelize'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { sequelize }
}) => {
  try {
    const { brwId } = payload
    const wholesalers = await sequelize.query(
      `
    SELECT
      companies.id AS company_id,
      companies.company_name AS name,
      states.state_name AS state,
      COUNT(orders.id) AS orders_count
    FROM
      companies,
      states,
      ( SELECT
          orders.id,
          orders."wholesalerId"
        FROM
          orders,
          products
        WHERE
          orders."productId" = products.id AND
          products."breweryId" = ?
      ) AS orders
    WHERE
      companies."stateId" = states.id AND
      orders."wholesalerId" = companies.id
    GROUP BY
      company_id, name, state
    `,
      {
        replacements: [brwId],
        returning: true,
        type: Sequelize.QueryTypes.SELECT
      }
    )
    emitAction('SET_WHOLESALERS', wholesalers)
  } catch (error) {
    log.err(error)
  }
}

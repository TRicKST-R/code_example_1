import log from '../../utils/log'

export default async ({
  payload = {},
  searchQuery,
  socket,
  emitAction,
  db: { DistributionCenter, sequelize },
  sessionData
}) => {
  const brewery = sessionData.get('companyId')

  const query = `SELECT
      dc.id as id,
      dc_name,
      array_agg(company_name) as companies
    FROM distribution_centers dc
      JOIN distribution_network dn on dc.id = dn."distributionCenterId"
      JOIN companies c2 on dn."companyId" = c2.id
    WHERE brewery = $brewery
    GROUP BY dc.id,dc_name`

  try {
    const distributionCentersList = await sequelize.query(query, {
      bind: { brewery },
      type: sequelize.QueryTypes.SELECT
    })

    emitAction('SET_DISTRIBUTION_CENTERS', {
      distributionCentersList
    })
  } catch (err) {
    log.err(err.message)
  }
}

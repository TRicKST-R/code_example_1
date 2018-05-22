import log from '../../utils/log'
import Sequelize from 'sequelize'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { sequelize }
}) => {
  try {
    const { brwId, offset } = payload
    const limit = 10

    const distCenters = await sequelize.query(
      `
    SELECT 
      distribution_centers.id as dc_id,
      distribution_centers.dc_name as dc_name, 
      states.state_name as dc_state
    FROM 
     public.distribution_centers, 
      public.states
    WHERE 
      distribution_centers."stateId" = states.id AND
      distribution_centers.brewery = ?;
    `,
      {
        replacements: [brwId],
        type: Sequelize.QueryTypes.SELECT
      }
    )
    console.log(distCenters)

    const dcMap = new Map()
    const dcIds = distCenters.map(row => {
      dcMap.set(row.dc_id, {
        name: row.dc_name,
        state: row.dc_state
      })
      return row.dc_id
    })

    const range = dcIds.join(', ')

    const transfers = await sequelize.query(
      `
    SELECT * FROM
      (SELECT 
        transfers.id AS transfer_id, 
        transfers.count AS count, 
        transfers.date AS date, 
        transfers."senderId" as sender, 
        transfers."receiverId" as receiver,
        transfers."productId" as product
      FROM 
        public.transfers
      WHERE 
         (transfers."senderId" IN (${range}) 
         OR
         transfers."receiverId" IN (${range}))
       ) AS trf,
       products
    WHERE 
      trf.product = products.id
    LIMIT ? OFFSET ?
    `,
      {
        replacements: [limit, offset],
        type: Sequelize.QueryTypes.SELECT
      }
    )

    console.log(transfers)
    transfers.map(tr => {
      tr.sender_name = dcMap.get(tr.sender).name
      tr.sender_state = dcMap.get(tr.sender).state
      tr.receiver_name = dcMap.get(tr.receiver).name
      tr.receiver_state = dcMap.get(tr.receiver).state
    })

    const canLoadMore = !(transfers.length < limit)

    emitAction('TRANSFERS_SHOW', {
      transfers,
      canLoadMore
    })
  } catch (error) {
    log.err(error)
  }
}

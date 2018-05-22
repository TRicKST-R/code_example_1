import log from '../../utils/log'
import { constructWhereClause } from './sharedCode/auxiliary'

export default async ({
  payload = {},
  socket,
  emitAction,
  sessionData,
  db: { Inventory }
}) => {
  try {
    let { offset, orderBy, filters = [] } = payload
    const limit = 10

    const companyId = sessionData.get('companyId')
    filters = [...filters, { column: 'companyId', searchKey: companyId }]
    const where = constructWhereClause(filters)
    console.log('filters: ', filters)
    const { count, rows: items } = await Inventory.findAndCountAll({
      order: [[orderBy, 'ASC']],
      where: filters ? where : null,
      offset,
      limit
    })

    const canLoadMore = count - offset - items.length > 0

    emitAction('SPLITS_SHOW_MORE', {
      items,
      canLoadMore
    })
  } catch (error) {
    log.err(error)
  }
}

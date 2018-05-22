import log from '../../utils/log'
import Sequelize from 'sequelize'

export default async ({
  payload = {},
  searchQuery,
  socket,
  emitAction,
  db: { Guideline }
}) => {
  let hasMore = true
  const Op = Sequelize.Op
  try {
    const limit = 10
    const { offset, searchQuery } = payload
    let where =
      searchQuery === ''
        ? false
        : {
          [Op.or]: {
            title: {
              [Op.like]: `%${searchQuery}%`
            },
            content: {
              [Op.like]: `%${searchQuery}%`
            },
            tags: {
              [Op.like]: `%${searchQuery}%`
            }
          }
        }
    let guidelines = await Guideline.findAll({
      limit,
      offset,
      where,
      raw: true
    })

    if (!guidelines) {
      hasMore = false
      emitAction('LOAD_MORE_GUIDES', { hasMore })
      return false
    }

    const checkHasMore = offset + limit + 1
    let nextGuide = await Guideline.findOne({ offset: checkHasMore, where })
    if (!nextGuide) hasMore = false
    emitAction('LOAD_MORE_GUIDES', {
      guidelines,
      hasMore
    })
  } catch (err) {
    hasMore = false
    emitAction('LOAD_MORE_GUIDES', { hasMore })
    log.err(`LOAD_MORE_GUIDES, ${err}`)
  }
}

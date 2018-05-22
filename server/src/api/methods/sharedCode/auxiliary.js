import { Op } from 'sequelize'
import moment from 'moment'

const productsCastToInt = [
  'id',
  'breweryId',
  'package',
  'group',
  'type',
  'count',
  'status',
  'companyId'
]
const empty = ['column']
const productsDisable = productsCastToInt.concat(empty)

export const constructWhereClause = filters => {
  return filters
    ? filters.reduce((query, { column, searchKey }) => {
        /* here only string values */
      if (productsDisable.indexOf(column) === -1) {
        query[column] = {
          [Op.iLike]: `%${searchKey}%`
        }
      }
        /* here only int values */
      if (productsCastToInt.indexOf(column) !== -1) {
        query[column] = {
          [Op.eq]: `${searchKey}`
        }
      }

      return query
    }, {})
    : null
}

export const createId = () => moment.now()

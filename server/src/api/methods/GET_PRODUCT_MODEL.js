import log from '../../utils/log'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { Product }
}) => {
  try {
    const keys = Product.rawAttributes
    const columns = []

    for (let key in keys) {
      let column = {}
      column.key = keys[key].field
      column.name = keys[key].fieldName
      column.options = keys[key].values
        ? keys[key].values.map(value => ({ id: value, title: value }))
        : null
      column.editable = true
      columns.push(column)
    }

    emitAction('SET_PRODUCTS_COLUMNS', columns)
  } catch (error) {
    log.err(error)
  }
}

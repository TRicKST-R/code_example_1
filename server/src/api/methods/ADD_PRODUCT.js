import log from '../../utils/log'
import _ from 'lodash'

export default async ({
  payload: product,
  socket,
  emitAction,
  db: { Product }
}) => {
  try {
    await Product.create(_.omit(product, ['id']))

    emitAction('UPDATE_PRODUCTS_LIST', { product, action: 'add' })
    emitAction('SNACK', {
      message: `New product has been successfully created`
    })
  } catch (error) {
    log.err(error.message)
    emitAction('SNACK', { message: `Failed to create new product` })
  }
}

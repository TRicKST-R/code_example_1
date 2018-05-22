import log from '../../utils/log'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { Product }
}) => {
  try {
    const { id, updated } = payload

    await Product.update(updated, { where: { id } })

    emitAction('UPDATE_PRODUCTS_LIST', { payload, action: 'update' })
    emitAction('SNACK', {
      message: `Product id ${id} has been successfully updated`
    })
  } catch (error) {
    log.err(error)
  }
}

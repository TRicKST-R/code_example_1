import log from '../../utils/log'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { Product }
}) => {
  try {
    const deletedProducts = payload
    deletedProducts.forEach(async productId => {
      await Product.destroy({
        where: {
          id: productId
        }
      })

      emitAction('UPDATE_PRODUCTS_LIST', { deletedProducts, action: 'delete' })
      emitAction('SNACK', {
        message: `Product(s) with id(s) ${deletedProducts.join()} has been successfully removed`
      })
    })
  } catch (error) {
    log.err(error)
    emitAction('SNACK', {
      message: `Failed to remove product(s) with id(s) ${payload.join()}`
    })
  }
}

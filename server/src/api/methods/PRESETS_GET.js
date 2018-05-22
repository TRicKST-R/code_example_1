import log from '../../utils/log'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { SearchPreset },
  sessionData,
  connectedUsers
}) => {
  const { scene } = payload
  const ownerId = sessionData.get('_id')

  let presets = []

  try {
    presets = await SearchPreset.findAll({
      where: {
        scene,
        ownerId
      }
    })
  } catch (err) {
    log.err(err.message)
  }

  switch (scene) {
    case 'products':
      emitAction('PRODUCTS_PRESETS_SET', presets)
      break
    case 'orders':
      emitAction('ORDERS_PRESETS_SET', presets)
      break
    case 'allocations':
      emitAction('ALLOCATIONS_PRESETS_SET', presets)
      break
    default:
      break
  }

  // emitAction(`${scene.toUpperCase()}_PRESETS_SET`, presets)
}

import log from '../../utils/log'

export default async ({
  payload,
  socket,
  emitAction,
  db: { SearchPreset },
  sessionData,
  connectedUsers
}) => {
  const { name, id, ...preset } = payload.preset
  const { scene } = payload
  const ownerId = sessionData.get('_id')
  let message = 'Empty preset'
  /* if payload obj present */
  if (preset) {
    try {
      /* create case */
      if (!id) {
        await SearchPreset.create({
          scene,
          name,
          ownerId,
          preset
        })
        message = 'Preset was saved successfully'
        /* update case */
      } else {
        await SearchPreset.update(
          {
            scene,
            name,
            ownerId,
            preset
          },
          {
            where: {
              id
            }
          }
        )
        message = 'Preset was updated successfully'
      }
      /* update presets list */
      let presets = await SearchPreset.findAll({
        where: {
          scene,
          ownerId
        }
      })

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
    } catch (err) {
      log.err(err)
      if (err.message === 'Validation error') {
        message = 'It seems that preset with that name is already present'
      } else {
        message = err.message
      }
    }
  }

  emitAction('SNACK', { message })
}

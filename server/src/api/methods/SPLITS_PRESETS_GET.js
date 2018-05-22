import log from '../../utils/log'

export default async ({
  payload = {},
  socket,
  emitAction,
  db: { SearchPreset },
  sessionData,
  connectedUsers
}) => {
  const scene = 'splits'
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

  emitAction('SPLITS_PRESETS_SET', presets)
}

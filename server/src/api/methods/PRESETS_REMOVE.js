import log from '../../utils/log'

export default async ({
  payload: { id },
  socket,
  emitAction,
  db: { SearchPreset },
  sessionData,
  connectedUsers
}) => {
  let message = `Preset with #${id} was deleted`
  try {
    await SearchPreset.destroy({
      where: {
        id
      }
    })
  } catch (err) {
    log.err(err.message)
    message = `Preset with #${id} was not deleted`
  }
  emitAction('SNACK', { message })
}

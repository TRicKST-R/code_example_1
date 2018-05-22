import createReducer from '../../../utils/createReducer'

const SHOW_DIALOG = 'SHOW_DIALOG'
const HIDE_DIALOG = 'HIDE_DIALOG'
const SAVE_DIALOG = 'SAVE_DIALOG'

const DialogState = {
  list: []
}

const dialogReducer = {
  [SHOW_DIALOG]: ({ list }, { dialogType, dialogProps }) => ({
    list: [...list, { dialogType, dialogProps }]
  }),
  [SAVE_DIALOG]: ({ list }, { dialogProps }) => {
    const lastDialog = list[list.length - 1]
    const newDialogProps = Object.assign(
      {},
      lastDialog.dialogProps,
      dialogProps
    )
    return {
      list: [
        ...list.slice(0, -1),
        Object.assign({}, lastDialog, {
          dialogProps: newDialogProps
        })
      ]
    }
  },
  [HIDE_DIALOG]: ({ list }) => ({
    list: list.slice(0, -1)
  })
}

const saveDialog = dialogProps => ({
  type: SAVE_DIALOG,
  payload: { dialogProps }
})

export const hideDialog = () => ({
  type: HIDE_DIALOG
})

export const showDialog = (
  dialogType,
  dialogProps,
  propsToSave = null
) => dispatch => {
  // propsToSave - optional. Used only when calling dialog inside another dialog
  // and to save state of the old one
  if (propsToSave) {
    dispatch(saveDialog(propsToSave))
  }

  return dispatch({
    type: SHOW_DIALOG,
    payload: {
      dialogType,
      dialogProps
    }
  })
}

export const dialogState = createReducer(dialogReducer, DialogState)

export const actions = {
  hideDialog,
  showDialog
}

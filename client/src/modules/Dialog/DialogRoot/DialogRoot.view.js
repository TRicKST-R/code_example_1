import React, { Component } from 'react'
import Dialog from 'material-ui/Dialog'
import FormDialog from '../../../components/Dialog/Types/FormDialog'
import SigninDialog from '../../../components/Dialog/Types/SigninDialog'
import AvatarLoaderDialog from '../../../components/Dialog/Types/AvatarLoaderDialog'
import { withStyles } from 'material-ui/styles'

const DIALOG_COMPONENTS = {
  FormDialog,
  SigninDialog,
  AvatarLoaderDialog
}

const dialogStyle = {
  paper: {
    margin: 0,
    maxHeight: '96vh'
  }
}

class DialogRoot extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }

  render () {
    const { dialogState: { list }, actions, classes } = this.props
    const dialog = list[list.length - 1]
    if (!dialog) return <Dialog open={false} />

    const { dialogType, dialogProps } = dialog
    const Specificdialog = DIALOG_COMPONENTS[dialogType]

    return (
      <Dialog
        maxWidth='md'
        open
        onClose={actions.hideDialog}
        classes={{
          paper: classes.paper
          // paperWidthXs: classes.paperWidthXs // className, e.g. `OverridesClasses-root-X`
        }}
      >
        <Specificdialog actions={actions} dialogProps={dialogProps} />
      </Dialog>
    )
  }
}
export default withStyles(dialogStyle)(DialogRoot)

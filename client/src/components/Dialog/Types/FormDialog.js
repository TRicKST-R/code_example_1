import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import { DialogContent, DialogActions, DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import { dialog as styles } from '../theme'

class FormDialog extends Component {
  constructor (props) {
    super(props)

    this.state = {
      controlledDate: this.props.dialogProps.date || null
    }
  }

  handleChange (event) {
    this.setState({
      controlledDate: event.target.value
    })
  }

  render () {
    const { classes, actions, dialogProps } = this.props
    return (
      <div>
        <DialogTitle>{dialogProps.title}</DialogTitle>
        <DialogContent>
          <TextField
            id='datetime-local'
            label='Birth date'
            type='date'
            defaultValue={this.state.controlledDate}
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={e => this.handleChange(e)}
          />
          <Button
            raised
            dense
            className={classes.buttonInDialog}
            onClick={() =>
              actions.showDialog(
                'SigninDialog',
                { foo: 'foo' },
                { date: this.state.controlledDate }
              )}
          >
            Open signin
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={actions.hideDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={actions.hideDialog} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </div>
    )
  }
}

export default withStyles(styles)(FormDialog)

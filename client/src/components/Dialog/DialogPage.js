import React, { Component } from 'react'
import Button from 'material-ui/Button'
import { dialog as styles } from './theme'
import { withStyles } from 'material-ui/styles'

class DialogPage extends Component {
  render () {
    const { classes, showDialog } = this.props
    return (
      <div>
        <Button
          raised
          dense
          className={classes.button}
          onClick={() =>
            showDialog('FormDialog', { title: 'Please fill out the date' })}
        >
          Open form
        </Button>
        <div style={{ margin: 40 }} />
        <Button
          raised
          dense
          className={classes.button}
          onClick={() => showDialog('SigninDialog', { title: 'Please log in' })}
        >
          Open Signin
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(DialogPage)

import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class SnackbarComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      message: ''
    }
    this.clearSnack = this.clearSnack.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      message: nextProps.snack.message,
      show: true
    })
  }

  clearSnack () {
    this.setState({ show: false, message: '' })
  }

  render () {
    const { show, message } = this.state
    return (
      <Snackbar
        style={{ zIndex: 3100 }}
        open={Boolean(show && message)}
        message={message}
        autoHideDuration={4000}
        onClose={this.clearSnack}
      />
    )
  }
}

SnackbarComponent.propTypes = {
  snack: PropTypes.object.isRequired
}

export default connect(state => ({
  snack: state.snack
}))(SnackbarComponent)

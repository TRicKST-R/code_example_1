import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from '../../../components/Dialog'

export default class DialogPage extends Component {
  render () {
    const { showDialog } = this.props
    return <Dialog showDialog={showDialog} />
  }
}

DialogPage.propTypes = {
  showDialog: PropTypes.func.isRequired
}

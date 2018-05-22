import React, { Component } from 'react'
import Button from 'material-ui/Button'

class Actions extends Component {
  render () {
    const { savePreset, preset: { id } } = this.props
    let title = 'Save current settings as preset'
    if (id) {
      title = 'Update preset'
    }
    return (
      <Button color='primary' onClick={savePreset || undefined}>
        {title}
      </Button>
    )
  }
}

export default Actions

import React from 'react'
import True from 'material-ui-icons/CheckBox'
import False from 'material-ui-icons/CheckBoxOutlineBlank'

class BooleanFormatter extends React.Component {
  render () {
    if (this.props.value) {
      return <True color='primary' />
    }
    return <False color='action' />
  }
}

export default BooleanFormatter

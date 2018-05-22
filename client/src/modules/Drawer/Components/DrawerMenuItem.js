import React, { Component } from 'react'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'

export default class DrawerMenuItem extends Component {
  render () {
    const { label, onClick, Icon } = this.props
    return (
      <ListItem button onClick={onClick}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItem>
    )
  }
}

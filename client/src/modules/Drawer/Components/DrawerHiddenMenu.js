import React, { Component } from 'react'
import Divider from 'material-ui/Divider'
import List from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import { styles } from '../theme'
import DrawerMenuItem from './DrawerMenuItem'

export class HiddenBlock extends Component {
  render () {
    const { opened, toggleDrawer, items } = this.props

    return (
      <div>
        <List onClick={() => (opened ? toggleDrawer() : null)}>
          {items.map(item => (
            <DrawerMenuItem key={`hidden_${item.label}`} {...item} />
          ))}
        </List>
        <Divider />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(HiddenBlock)

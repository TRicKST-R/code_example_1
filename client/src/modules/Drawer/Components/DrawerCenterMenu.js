import React, { Component } from 'react'
import List from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import { styles } from '../theme'
import DrawerMenuItem from './DrawerMenuItem'

export class CenterBlock extends Component {
  render () {
    const { classes, opened, toggleDrawer, items } = this.props

    return (
      <div className={classes.flexStart}>
        <List
          className={classes.centerList}
          onClick={() => (opened ? toggleDrawer() : null)}
        >
          {items.map((item, index) => <DrawerMenuItem key={index} {...item} />)}
        </List>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CenterBlock)

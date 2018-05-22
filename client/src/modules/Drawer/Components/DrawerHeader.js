import React, { Component } from 'react'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import AccountCircle from 'material-ui-icons/AccountCircle'
import { ListItem, ListItemText } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import { styles } from '../theme'

export class HeaderBlock extends Component {
  render () {
    const { primary, secondary, toggleHiddenBlock, classes } = this.props
    return (
      <div className={classes.drawerHeader}>
        <ListItem onClick={toggleHiddenBlock} button>
          <Avatar>
            <AccountCircle />
          </Avatar>
          <ListItemText
            primary={primary}
            secondary={secondary}
            classes={{
              root: classes.avatarText,
              text: classes.listItemText,
              primary: classes.listItemText
            }}
          />
        </ListItem>
        <Divider />
      </div>
    )
  }
}

export default withStyles(styles)(HeaderBlock)

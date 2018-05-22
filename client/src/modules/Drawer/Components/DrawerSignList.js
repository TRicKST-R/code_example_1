import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { styles, drawerWidth } from '../theme'
import Popover from 'material-ui/Popover'
import { ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import AccountCircle from 'material-ui-icons/AccountCircle'
import PersonAdd from 'material-ui-icons/PersonAdd'
import Button from 'material-ui/Button'
import Clear from 'material-ui-icons/Clear'

export class SignList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: props.userList,
      open: true
    }
    this.changeUser = this.changeUser.bind(this)
    this.removeUser = this.removeUser.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose () {
    /* without it will be bad ux */
    const { toggleHiddenBlock } = this.props
    console.log('toggleHiddenBlock: ', toggleHiddenBlock)
    toggleHiddenBlock()

    this.setState({
      open: false
    })
  }

  changeUser (index) {
    return (e) => {
      this.props.changeUser(index)
    }
  }

  removeUser (index) {
    return (e) => {
      e.stopPropagation()
      this.props.removeUser(index)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ users: nextProps.userList })
  }

  render () {
    const { classes, showDialog, signIn } = this.props
    return (
      <Popover
        open={this.state.open}
        anchorPosition={{ top: 0, left: drawerWidth }}
        anchorReference={'anchorPosition'}
        onClose={this.handleClose}
      >
        {this.state.users.map((user, index) => {
          return (
            <ListItem
              button
              key={index}
              className={classes.popoverItem}
              data-index={index}
              onClick={this.changeUser(index)}
            >
              <Avatar>
                <AccountCircle />
              </Avatar>
              <ListItemText primary={user.name} secondary={user.email} />
              <Button
                size='small'
                mini
                aria-label='remove'
                data-index={index}
                onClick={this.removeUser(index)}
              >
                <Clear />
              </Button>
            </ListItem>
          )
        })}
        <ListItem
          button
          key={this.state.users.length}
          className={classes.popoverItem}
        >
          <Avatar>
            <PersonAdd />
          </Avatar>
          <ListItemText
            primary='Add User'
            onClick={() => {
              showDialog('SigninDialog', {
                title: 'Sign in',
                signIn
              })
            }}
          />
        </ListItem>
      </Popover>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SignList)

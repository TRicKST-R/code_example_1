import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'

class SigninDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.signIn = this.signIn.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
  }

  onKeyPress ({ nativeEvent: { keyCode } }) {
    if (keyCode === 13) {
      this.signIn()
    }
  }

  handleChange (name) {
    /* we do not want to do bind in render because of every time new function will be created  */
    return ({ target: { value } }) => {
      this.setState({
        [name]: value
      })
    }
  }

  signIn () {
    const { email, password } = this.state

    if (!email || !password) {
      alert('Fill in all the fields')
      return false
    }

    const { signIn } = this.props.dialogProps

    // если full === false, то сессия не создается, получаем только токен
    const full = false
    signIn({ email, password, full })

    this.setState({
      email: '',
      password: ''
    })
  }

  render () {
    const { dialogProps, actions } = this.props
    const { email, password } = this.state

    return (
      <div>
        <DialogContent>
          <DialogContentText>{dialogProps.title}</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Email Address'
            type='email'
            fullWidth
            value={email}
            onChange={this.handleChange('email')}
            onKeyPress={this.onKeyPress}
          />
          <TextField
            margin='dense'
            label='Password'
            fullWidth
            value={password}
            onChange={this.handleChange('password')}
            type='password'
            onKeyPress={this.onKeyPress}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={actions.hideDialog} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.signIn()
            }}
            color='primary'
          >
            Add User
          </Button>
        </DialogActions>
      </div>
    )
  }
}

export default SigninDialog

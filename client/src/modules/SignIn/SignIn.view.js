import SignInForm from '../../components/SignInForm'
import React, { Component } from 'react'
import Spinner from '../../components/Spinner'

export default class SignIn extends Component {
  render () {
    return (
      <div>
        <SignInForm {...this.props} />
        <Spinner target='SignIn' />
      </div>
    )
  }
}

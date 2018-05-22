import React, { Component } from 'react'

export default class UsersList extends Component {
  render () {
    return (
      <div>
        <p>This is users list</p>
        <button onClick={() => this.props.push('/user-details')}>
          To user details
        </button>
      </div>
    )
  }
}

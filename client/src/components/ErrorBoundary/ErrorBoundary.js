import React, { Component } from 'react'
import errorHandler from '../Stackdriver/errorHandler'

export default class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true, errorMessage: error.message })
    // You can also log the error to an error reporting service
    console.log('error', error)
    console.log('info', info)
    errorHandler.report(error)
  }

  render () {
    const { hasError, errorMessage } = this.state
    if (hasError && errorMessage) {
      return <div>Sorry, error occured: {errorMessage}</div>
    }
    return this.props.children
  }
}

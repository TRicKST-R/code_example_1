/* eslint-disable import/no-named-as-default */
import React from 'react'
import PropTypes from 'prop-types'
import DialogRoot from './../modules/Dialog/DialogRoot/DialogRoot.container'
import Routes from './Routes'
import AppBar from './AppBar'
import { withStyles } from 'material-ui/styles'
import { rootStyle as styles } from './theme'
import Snackbar from './SnackBar'
import ErrorBoundary from '../components/ErrorBoundary'
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <ErrorBoundary>
            <AppBar />
          </ErrorBoundary>
          <div className={classes.content}>
            <Routes />
          </div>
          <ErrorBoundary>
            <DialogRoot />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <Snackbar />
        </ErrorBoundary>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element
}

export default withStyles(styles)(App)

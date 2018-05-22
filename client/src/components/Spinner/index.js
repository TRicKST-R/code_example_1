import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { connect } from 'react-redux'

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: '.25s easy',
    zIndex: -1,
    opacity: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  show: {
    zIndex: 3000,
    opacity: 1
  },
  relative: {
    position: 'relative',
    padding: '32px'
  }
})
class Spinner extends Component {
  render () {
    const { classes } = this.props
    const {
      size,
      thickness,
      target,
      spinnerState,
      forceShow,
      relative,
      bgColor
    } = this.props
    let className = classes.root
    if (forceShow || spinnerState[target]) {
      className = `${classes.root} ${classes.show}`
    }
    if (relative) {
      className = `${className} ${classes.relative}`
    }
    return (
      <div className={className} style={{ backgroundColor: bgColor }}>
        <CircularProgress
          size={size || 60}
          thickness={thickness || 5}
          color='primary'
        />
      </div>
    )
  }
}

export default connect(state => ({
  spinnerState: state.spinner
}))(withStyles(styles)(Spinner))

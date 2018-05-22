import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import { TableCell } from 'material-ui/Table'

const styles = theme => ({
  ellipsis: {
    width: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
})

/* renders single cell */

export class Cell extends Component {
  render () {
    const { classes, value } = this.props
    return (
      <TableCell>
        <div className={classes.ellipsis} title={value}>
          {value}
        </div>
      </TableCell>
    )
  }
}

Cell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default withStyles(styles)(Cell)

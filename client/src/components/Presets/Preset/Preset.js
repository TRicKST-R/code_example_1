import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import { ListItem } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui-icons/Delete'

class Preset extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hover: false
    }
  }

  setHoverStateOn () {
    let { hover } = { ...this.state }
    hover = true
    this.setState({ hover })
  }

  setHoverStateOff () {
    let { hover } = { ...this.state }
    hover = false
    this.setState({ hover })
  }

  render () {
    return (
      <Grid
        container
        onMouseEnter={this.setHoverStateOn.bind(this)}
        onMouseLeave={this.setHoverStateOff.bind(this)}
      >
        <ListItem button>
          <Grid onClick={this.props.choosePreset} item xs={11}>
            <Typography variant='body2'>{this.props.name}</Typography>
            <Typography variant='caption'>
              Columns: {this.props.columns.join(', ')}
            </Typography>
            <Typography variant='caption'>
              Order by: {this.props.orderBy}
            </Typography>
            <Typography variant='caption'>
              Filtering:{' '}
              {this.props.filtering
                .map(({ searchKey }) => searchKey)
                .join(', ')}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Grid container justify='space-around'>
              {this.state.hover && (
                <IconButton
                  onClick={() => this.props.onDeleteBtnClick(this.props.name)}
                >
                  <Delete />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </ListItem>
      </Grid>
    )
  }
}

export default Preset

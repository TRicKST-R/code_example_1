import React from 'react'
import { MenuItem } from 'material-ui/Menu'
import TextField from 'material-ui/TextField'
import { FormControl } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import _ from 'lodash'

const styles = {
  form: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 20
  }
}

class RowCreator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      row: {
        id: -1
      }
    }
  }

  componentWillMount () {
    const state = this.props.columns.reduce((state, column) => {
      state[column.key] = ''
      return state
    }, {})
    this.setState(state)
  }

  handleChange (e) {
    const { id, value, name } = e.target
    const row = { ...this.state.row }

    if (name) {
      row[name] = value
      this.setState({
        [name]: value,
        row
      })
    } else if (id) {
      row[id] = value
      this.setState({
        [id]: value,
        row
      })
    }

    this.checkReady(row)
  }

  checkReady (row) {
    const ready = this.props.columns.reduce((ready, column) => {
      if (ready) {
        ready = _.has(row, column.key)
      }
      return ready
    }, true)

    if (ready) {
      this.props.onRowCreated(row)
    }
  }

  render () {
    return (
      <FormControl className={this.props.classes.form}>
        {this.props.columns.reduce((form, column) => {
          if (column.key === 'id') {
            return form
          }
          if (column.options) {
            form.push(
              <TextField
                name={column.key}
                key={column.key}
                id={column.key}
                label={column.name}
                select
                value={this.state[column.key]}
                margin='normal'
                onChange={this.handleChange.bind(this)}
              >
                {column.options.map(option => (
                  <MenuItem key={option.id} value={option.title}>
                    {option.title}
                  </MenuItem>
                ))}y
              </TextField>
            )
            return form
          } else {
            form.push(
              <TextField
                key={column.key}
                value={this.state[column.key]}
                required
                id={column.key}
                label={column.name}
                onChange={this.handleChange.bind(this)}
                margin='normal'
              />
            )
            return form
          }
        }, [])}
      </FormControl>
    )
  }
}

export default withStyles(styles)(RowCreator)

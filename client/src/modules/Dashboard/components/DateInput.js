import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types'
import DatePicker from './DatePicker'
import moment from 'moment'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
})

export class DateInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editorOpen: false,
      value: this.props.value
    }
  }

  openEditor () {
    this.setState({
      editorOpen: true
    })
  }

  onEditorClick (e, editor) {
    if (editor && !editor.contains(e.target)) {
      this.setState({
        editorOpen: false
      })
    }
  }

  onDatePick (date) {
    const value = moment(date).format('MM/DD/YYYY')
    const formattedValue = moment(date).format('YYYY-MM-DD')

    this.setState({
      editorOpen: false,
      value
    })

    this.props.handleChange({ target: { value: formattedValue } })
  }

  render () {
    const { classes, handleChange, label } = this.props
    const { editorOpen, value } = this.state

    return (
      <Grid item xs={6} md={3}>
        <TextField
          label={label}
          className={classes.textField}
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true
          }}
          value={value}
          disabled={editorOpen}
          onChange={handleChange}
          onClick={this.openEditor.bind(this)}
        />
        {editorOpen && (
          <DatePicker
            value={value}
            onChange={this.onDatePick.bind(this)}
            onClick={this.onEditorClick.bind(this)}
          />
        )}
      </Grid>
    )
  }
}

DateInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChange: PropTypes.func
}

export default withStyles(styles)(DateInput)

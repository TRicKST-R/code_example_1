import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'
import PropTypes from 'prop-types'

class SharedSelectTextField extends Component {
  render () {
    const { data = [], label, inputStyles, handleChange, value } = this.props
    return (
      <TextField
        id='select-currency'
        fullWidth
        select
        label={label}
        value={value}
        disabled={data.length === 0}
        margin='normal'
        type='text'
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
          className: inputStyles
        }}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              style: {
                /* height of element(48px * 4) + 16px of list padding */
                maxHeight: 208
              }
            }
          }
        }}
      >
        {data.map((option, i) => (
          <MenuItem title={option.label} key={i} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    )
  }
}

SharedSelectTextField.propTypes = {
  /* name */
  label: PropTypes.string,
  /* selected value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /* array of options with shape {label, value} */
  data: PropTypes.array,
  /* styles */
  inputStyles: PropTypes.string,
  /* listen to user input and changes state of parent component  */
  handleChange: PropTypes.func
}

export default SharedSelectTextField

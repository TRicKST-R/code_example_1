import React from 'react'
import { withStyles } from 'material-ui/styles'
import Input, { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import Select from 'material-ui/Select'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: `100%`
  },
  formControl: {
    minWidth: '100%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit / 4
  }
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

class SharedMultipleSelect extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.sendToParent = this.sendToParent.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.state = {
      selected: this.props.selectedValues,
      open: false
    }
  }

  componentWillReceiveProps ({ selectedValues }) {
    if (selectedValues) {
      this.setState({
        selected: selectedValues
      })
    }
  }

  handleChange ({ target: { value: selected } }) {
    this.setState({ selected })
  }
  /* call on close */
  sendToParent () {
    this.setState(
      {
        ...this.state,
        open: false
      },
      () => {
        /* send to parent the data */
        const { handleChange } = this.props
        handleChange({
          target: {
            value: this.state.selected
          }
        })
      }
    )
  }

  onOpen () {
    this.setState({
      ...this.state,
      open: true
    })
  }

  render () {
    const { classes, theme, options = [], label } = this.props

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='select-multiple'>{label}</InputLabel>
          <Select
            multiple
            fullWidth
            value={this.state.selected}
            onChange={this.handleChange}
            input={<Input id='select-multiple' />}
            MenuProps={MenuProps}
            open={this.state.open}
            onClose={this.sendToParent}
            onOpen={this.onOpen}
          >
            {options.map(({ label, value }, index) => (
              <MenuItem
                key={index}
                value={value}
                style={{
                  fontWeight:
                    this.state.selected.indexOf(value) === -1
                      ? theme.typography.fontWeightRegular
                      : theme.typography.fontWeightMedium
                }}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SharedMultipleSelect)

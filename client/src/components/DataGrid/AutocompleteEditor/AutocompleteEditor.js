const React = require('react')
const ReactDOM = require('react-dom')
const ReactAutocomplete = require('../Autocomplete/reactAutoComplete')
const { shapes: { ExcelColumn } } = require('react-data-grid')

import PropTypes from 'prop-types'

let optionPropType = PropTypes.shape({
  id: PropTypes.required,
  title: PropTypes.string
})

class AutoCompleteEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      style: {
        position: 'fixed',
        x: 0,
        y: 0
      }
    }
  }

  static propTypes = {
    onCommit: PropTypes.func,
    options: PropTypes.arrayOf(optionPropType),
    label: PropTypes.any,
    value: PropTypes.any,
    height: PropTypes.number,
    valueParams: PropTypes.arrayOf(PropTypes.string),
    column: PropTypes.shape(ExcelColumn),
    resultIdentifier: PropTypes.string,
    search: PropTypes.string,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    editorDisplayValue: PropTypes.func
  }

  static defaultProps = {
    resultIdentifier: 'id'
  }

  handleChange = () => {
    this.props.onCommit()
  }

  getValue = (): any => {
    let value
    let updated = {}
    if (this.hasResults() && this.isFocusedOnSuggestion()) {
      value = this.getLabel(this.autoComplete.state.focusedValue)
      if (this.props.valueParams) {
        value = this.constuctValueFromParams(
          this.autoComplete.state.focusedValue,
          this.props.valueParams
        )
      }
    } else if (this.hasResults()) {
      value = this.autoComplete.state.results[0].title
    } else {
      value = this.props.options[0].title
    }

    updated[this.props.column.key] = value
    return updated
  }

  getEditorDisplayValue = () => {
    let displayValue = { title: '' }
    let { column, value, editorDisplayValue } = this.props
    if (editorDisplayValue && typeof editorDisplayValue === 'function') {
      displayValue.title = editorDisplayValue(column, value)
    } else {
      displayValue.title = value
    }
    return displayValue
  }

  getInputNode = () => {
    const input = ReactDOM.findDOMNode(this).getElementsByTagName('input')[0]
    if (input) {
      let { style } = { ...this.state }
      const { x, y } = input.getBoundingClientRect()
      style.x = x
      style.y = y

      this.setState({
        style
      })
    }
    return input
  }

  getLabel = (item: any): string => {
    let label = this.props.label != null ? this.props.label : 'title'
    if (typeof label === 'function') {
      return label(item)
    } else if (typeof label === 'string') {
      return item[label]
    }
  }

  hasResults = (): boolean => {
    return this.autoComplete.state.results.length > 0
  }

  isFocusedOnSuggestion = (): boolean => {
    let autoComplete = this.autoComplete
    return autoComplete.state.focusedValue != null
  }

  constuctValueFromParams = (obj: any, props: ?Array<string>) => {
    if (!props) {
      return ''
    }

    let ret = []
    for (let i = 0, ii = props.length; i < ii; i++) {
      ret.push(obj[props[i]])
    }
    return ret.join('|')
  }

  render (): ?ReactElement {
    let label = this.props.label != null ? this.props.label : 'title'
    // const { x, y } = this.state
    // console.log(x, y)
    const { style } = this.state
    console.log(style)

    return (
      <div height={this.props.height} onKeyDown={this.props.onKeyDown}>
        <ReactAutocomplete
          search={this.props.search}
          ref={node => (this.autoComplete = node)}
          label={label}
          onChange={this.handleChange}
          onFocus={this.props.onFocus}
          resultIdentifier={this.props.resultIdentifier}
          options={this.props.options}
          value={this.getEditorDisplayValue()}
        />
      </div>
    )
  }
}

export default AutoCompleteEditor

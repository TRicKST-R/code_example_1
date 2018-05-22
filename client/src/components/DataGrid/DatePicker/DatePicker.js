import React from 'react'
import ReactDOM from 'react-dom'
import Picker from 'react-date-picker/dist/entry.nostyle'
import moment from 'moment'

class DatePicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      get date () {
        return moment(props.value, 'MM/DD/YYYY').toDate()
      }
    }
  }

  onChange (date) {
    this.setState({ date })
  }

  getInputNode () {
    return ReactDOM.findDOMNode(this).getElementsByTagName('input')[0]
  }

  getValue () {
    let date = moment(this.state.date).format('MM/DD/YYYY')
    let updated = {}
    updated[this.props.column.key] = date || this.getEditorDisplayValue()
    return updated
  }

  getEditorDisplayValue () {
    const { value } = this.props
    return moment(value, 'MM/DD/YYYY').toDate()
  }

  render () {
    const date = this.state.date
    return (
      <div className='mui-theme-datepicker'>
        <div className='mui-theme-datepicker__current'>
          <div>
            <time className='mui-theme-datepicker__currentYear'>
              {' '}
              {moment(date).format('YYYY')}
            </time>
          </div>
          <div className='mui-theme-datepicker__currentDay'>
            <time>{moment(date).format('ddd')}, </time>
            <time>{moment(date).format('MMM')} </time>
            <time>{moment(date).format('D')}</time>
          </div>
        </div>
        <Picker
          onChange={this.onChange.bind(this)}
          value={date}
          locale={'en-US'}
          isOpen
          minDetail={'year'}
        />
      </div>
    )
  }
}

export default DatePicker

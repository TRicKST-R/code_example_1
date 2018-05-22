import React from 'react'
import Picker from 'react-date-picker/dist/entry.nostyle'
import moment from 'moment'
import '../../../components/DataGrid/material-ui-next.theme.css'

class DatePicker extends React.Component {
  onClick (e) {
    this.props.onClick(e, this.wrapper)
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.onClick.bind(this))
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.onClick.bind(this))
  }

  render () {
    const { value, onChange } = this.props
    const date = moment(value, 'MM/DD/YYYY').toDate()

    return (
      <div
        className='mui-theme-datepicker'
        ref={ref => {
          this.wrapper = ref
        }}
      >
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
          onChange={onChange}
          isOpen
          value={date}
          locale={'en-US'}
          minDetail={'year'}
        />
      </div>
    )
  }
}

export default DatePicker

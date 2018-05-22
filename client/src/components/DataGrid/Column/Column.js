import React from 'react'
import AutocompleteEditor from '../AutocompleteEditor/AutocompleteEditor'
import DatePicker from '../DatePicker/DatePicker'
import BooleanFormatter from '../BooleanFormatter/BooleanFormatter'

class Column {
  constructor (rawColumn, handlers) {
    this.handlers = handlers
    this.key = rawColumn.key
    this.name = rawColumn.name
    // this.editable = this.isEditable(rawColumn)
    this.editable = function (row) {
      // unfinished: preventing random cell editing
      const columnEditable = rawColumn.key !== 'id' && rawColumn.editable
      // temporary solution, consider revision
      // const rowEditable = row.preventEdit ? false : true
      //
      // return columnEditable && rowEditable
      return columnEditable
    }
    this.width = rawColumn.width
    this.editor = this.getEditor(rawColumn)
    this.cellClass = this.getCellClass(rawColumn)
    this.events = this.getEventHandlers(rawColumn)
    this.formatter = this.getFormatter(rawColumn)
  }

  // temporary solution, currently setting 'id' as not editable for example
  // isEditable (rawColumn) {
  //   return rawColumn.key !== 'id' && rawColumn.editable
  // }
  //

  getEditor (rawColumn) {
    if (rawColumn.options && rawColumn.editable) {
      return <AutocompleteEditor options={rawColumn.options} />
    }

    if (rawColumn.type === 'date' && rawColumn.editable) {
      return <DatePicker />
    }
  }

  getFormatter (rawColumn) {
    if (rawColumn.type === 'checkbox') {
      return <BooleanFormatter />
    }
  }

  getCellClass (rawColumn) {
    let classes = []
    if (rawColumn.options && rawColumn.editable) {
      classes.push('has-dropdown')
    }
    if (rawColumn.type === 'checkbox') {
      classes.push('ta-center')
      classes.push('with-checkbox')
    }
    return classes.join(' ')
  }

  getEventHandlers (rawColumn) {
    let events = {}
    events.onContextMenu = rawColumn.noContextMenu
      ? null
      : this.handlers.rightClickHandler
    switch (rawColumn.type) {
      case 'date':
        events.onKeyDown = this.handlers.datepickerKeyHandler
        break
      case 'checkbox':
        events.onClick = this.handlers.checkboxHandler
        events.onKeyDown = this.handlers.kbCheckboxHandler
        break
      default:
        break
    }
    return events
  }
}

export default Column

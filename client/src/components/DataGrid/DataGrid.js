import ReactDataGrid from 'react-data-grid'
import React from 'react'
import Column from './Column'
import update from 'immutability-helper'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import Button from 'material-ui/Button'
import Toolbar from 'material-ui/Toolbar'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import './material-ui-next.theme.css'
// import Paper from 'material-ui/Paper'
// import Typography from 'material-ui/Typography'
// import AutocompleteEditor from './AutocompleteEditor/AutocompleteEditor'
// import DatePicker from './DatePicker/DatePicker'
// import RowCreator from './RowCreator/RowCreator'
// import Modal from 'material-ui/Modal'
// import AddIcon from 'material-ui-icons/AddCircleOutline'
// import IconButton from 'material-ui/IconButton'
// import BooleanFormatter from './BooleanFormatter/BooleanFormatter'

const styles = {
  flex: {
    flex: 1
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

class DataGrid extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.canvas = null
    this.rowHeight = 48
    this.scrollHandler = this.scrollListener.bind(this)
    this.state = {
      // grid render
      columns: this.createColumns(props.columns),
      rows: this.getRows(props.rows),
      minHeight: this.getMinHeight(this.rowHeight, 1),
      // context menu handling
      isAnyCellClicked: false,
      rowClicked: null,
      rowClickedId: null,
      cellClicked: null,
      columnClicked: null,
      clickType: null,
      // others
      modalOpen: false,
      rowCreated: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const columns = this.createColumns(nextProps.columns)
    const { rows } = nextProps
    const minHeight = rows ? this.getMinHeight(this.rowHeight, rows.length) : 0

    this.setState({
      minHeight,
      columns,
      rows: this.getRows(rows)
    })
  }

  componentWillMount () {
    const { rows } = this.props ? this.props : null
    if (rows) {
      const minHeight = rows
        ? this.getMinHeight(this.rowHeight, rows.length)
        : 0
      this.setState({ minHeight })
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.scrollHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  scrollListener () {
    const top = window.pageYOffset || document.documentElement.scrollTop
    const scrollPosition = top + window.innerHeight

    function getDocHeight () {
      let D = document
      return Math.max(
        D.body.scrollHeight,
        D.documentElement.scrollHeight,
        D.body.offsetHeight,
        D.documentElement.offsetHeight,
        D.body.clientHeight,
        D.documentElement.clientHeight
      )
    }
    if (scrollPosition >= getDocHeight()) {
      this.props.loadMoreRows()
    }
  }

  getMinHeight (rowHeight, rowsCount = 0) {
    // temporary solution, need to find a more elegant way to consider scrollbar height
    return rowHeight * (rowsCount + 1) + 15
  }

  getRows (rawRows) {
    // unfinished: adding total row
    // if (this.props.addTotal) {
    //   const { title, sum } = this.props.addTotal
    //   let totalsRowModel = {}

    //   sum.forEach(key => {
    //     totalsRowModel[key] = 0
    //   })

    //   function toTotalsRow(total, row) {
    //     for (let key in total) {
    //       total[key] += parseInt(row[key])
    //     }
    //     return total
    //   }

    //   const totalsRow = rawRows.reduce(toTotalsRow, totalsRowModel)

    //   totalsRow.preventEdit = true
    //   totalsRow[title.column] = title.text

    //   rawRows.push(totalsRow)
    //   return rawRows
    // } else {
    return rawRows
    // }
  }

  createColumns (columnsRaw) {
    if (!columnsRaw) {
      return []
    }

    const handlers = {
      rightClickHandler: this.handleClick.bind(this),
      datepickerKeyHandler: this.preventUnwantedKeyboardActions,
      checkboxHandler: this.handleCheckbox.bind(this),
      kbCheckboxHandler: this.handleCheckboxFromKeyboard.bind(this)
    }

    return columnsRaw.reduce((columns, rawColumn) => {
      columns.push(new Column(rawColumn, handlers))
      return columns
    }, [])
  }

  handleRowUpdate (update) {
    const { rowIdx, updated } = update
    const id = this.state.rows[rowIdx].id

    this.props.updateRow({
      id,
      updated
    })
  }

  handleClick (e, args) {
    this.setState({
      rowClicked: args.rowIdx,
      rowClickedId: args.rowId,
      cellClicked: args.idx,
      columnClicked: args.column.key,
      columnClickedName: args.column.name,
      isAnyCellClicked: true,
      clickType: e.type
    })
  }

  clearClickState () {
    this.setState({
      rowClicked: null,
      rowClickedId: null,
      cellClicked: null,
      columnClicked: null,
      isAnyCellClicked: false
    })
  }

  handleCheckbox (e, args) {
    const rows = [...this.state.rows]
    rows[args.rowIdx][args.column.key] = !rows[args.rowIdx][args.column.key]
    this.setState({ rows })
  }

  handleCheckboxFromKeyboard (e, args) {
    if (e.key === ' ' || e.key === 'Enter') {
      this.handleCheckbox(e, args)
    }
  }

  preventUnwantedKeyboardActions (e) {
    function isAllowedKey (key) {
      const allowedKeys = [
        'Escape',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight'
      ]

      return allowedKeys.find(allowedKey => {
        return allowedKey === key
      })
    }

    if (!isAllowedKey(e.key)) {
      e.stopPropagation()
    }
  }

  getClickedRowData () {
    if (this.state.rowClicked === null) {
      return null
    }
    const rowIdx = this.state.rowClicked
    return {
      data: this.state.rows[rowIdx],
      idx: rowIdx
    }
  }

  deleteRow () {
    if (confirm('Are you sure?')) {
      this.setState(
        {
          considerRow: this.getClickedRowData()
        },
        () => {
          const state = { ...this.state }
          const id = state.considerRow.data.id
          this.props.deleteRows([id])

          let rows = [...state.rows]
          const idx = state.considerRow.idx
          let rowsCount = state.rowsCount

          rows.splice(idx, 1)
          rowsCount -= 1

          this.setState({
            rows,
            rowsCount,
            considerRow: null
          })
        }
      )
    }
  }

  handleContextMenuItemClick (cb) {
    this.setState(
      {
        considerRow: this.getClickedRowData()
      },
      () => {
        const { considerRow } = this.state
        cb(considerRow)
      }
    )
  }

  // currently unused methods
  // addRow () {
  //   this.props.addRow(this.state.newRow)
  //   this.setState({
  //     newRow: null,
  //     rowCreated: false
  //   })
  // }
  //
  // handleNewRow (row) {
  //   this.setState({
  //     rowCreated: true,
  //     newRow: row
  //   })
  // }
  //
  //
  // callModal (modal) {
  //   this.setState({
  //     modalOpen: true,
  //     considerRow: this.getClickedRowData(),
  //     modal
  //   })
  // }
  //
  // closeModal () {
  //   this.setState({
  //     modalOpen: false,
  //     modal: null
  //   })
  // }
  //

  rowGetter (i) {
    return this.state.rows[i]
  }

  handleGridRowsUpdated ({ fromRow, toRow, updated }) {
    let rows = this.state.rows.slice()

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i]
      let updatedRow = update(rowToUpdate, {
        $merge: updated
      })
      rows[i] = updatedRow
    }
    this.setState({ rows })
  }

  render () {
    const contextState = this.state.isAnyCellClicked ? '' : 'hidden'

    return (
      <div>
        <div className='mui-theme'>
          <ContextMenuTrigger
            disable={!this.props.showContextMenu}
            id='ctxMenuTrigger'
            holdToDisplay={500}
          >
            {this.state.columns &&
              this.state.rows && (
                <ReactDataGrid
                  rowHeight={this.rowHeight}
                  enableCellSelect
                  columns={this.state.columns}
                  rowGetter={this.rowGetter.bind(this)}
                  rowsCount={this.state.rows.length}
                  onGridRowsUpdated={this.handleGridRowsUpdated.bind(this)}
                  minHeight={this.state.minHeight}
                  onRowUpdated={this.handleRowUpdate.bind(this)}
                />
              )}
            <ContextMenu
              id='ctxMenuTrigger'
              className={contextState}
              style={{
                zIndex: 10
              }}
              onHide={this.clearClickState.bind(this)}
            >
              {/* <MenuItem onClick={this.deleteRow.bind(this)}>
                Delete {this.props.gridItem}
              </MenuItem> */}

              {this.props.contextMenuItems &&
                this.props.contextMenuItems.map(item => {
                  return (
                    <MenuItem
                      key={item.name}
                      onClick={this.handleContextMenuItemClick.bind(
                        this,
                        item.callback
                      )}
                    >
                      {item.name}
                    </MenuItem>
                  )
                })}
            </ContextMenu>
          </ContextMenuTrigger>
        </div>
        {this.props.canLoadMore && (
          <Toolbar className={this.props.classes.flexCenter}>
            <Button onClick={this.props.loadMoreRows}>Load more</Button>
          </Toolbar>
        )}
      </div>
    )
  }
}

DataGrid.propTypes = {
  gridTitle: PropTypes.string,
  gridItem: PropTypes.string,
  showContextMenu: PropTypes.bool,
  canLoadMore: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  allColumns: PropTypes.arrayOf(PropTypes.object),
  loadMoreRows: PropTypes.func,
  deleteRows: PropTypes.func,
  updateRow: PropTypes.func,
  addRow: PropTypes.func
}

export default withStyles(styles)(DataGrid)

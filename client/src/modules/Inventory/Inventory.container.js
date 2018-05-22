import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import InventoryView from './Inventory.view'
import { splits } from './Inventory.state'
import { push } from 'react-router-redux'

export default connect(
  ({ inventoryState }) => ({
    inventoryState
  }),
  dispatch => ({
    splits: bindActionCreators(splits, dispatch),
    push: bindActionCreators(push, dispatch)
  })
)(InventoryView)
